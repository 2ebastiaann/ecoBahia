import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrarse.html',
  styleUrls: ['./registrarse.scss']
})
export class Register {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTerms: boolean = false;
  showPassword: boolean = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';

  constructor(private router: Router, private authService: AuthService) {}

  handleSubmit(): void {
    if (!this.isFormValid()) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!this.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: res => {
        if (res.ok) {
          alert(`¡Registro exitoso! Bienvenido ${this.email}`);
          this.router.navigate(['/login']);
        } else {
          alert(`Error al registrar: ${res.error}`);
        }
      },
      error: err => {
        console.error('Error en registro:', err);
        alert('Error al registrar usuario');
      }
    });
  }

  handleGoogleRegister(): void {
    console.log('Registro con Google');
    alert('Redirigiendo a Google...');
  }

  handleBack(): void {
    this.router.navigate(['/login']);
  }

  handleGoToLogin(): void {
    this.router.navigate(['/login']);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(): void {
    const password = this.password;
    const length = password.length;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;

    if (strength <= 2) this.passwordStrength = 'weak';
    else if (strength <= 4) this.passwordStrength = 'medium';
    else this.passwordStrength = 'strong';
  }

  getPasswordStrengthWidth(): string {
    switch (this.passwordStrength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
    }
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Débil';
      case 'medium': return 'Media';
      case 'strong': return 'Fuerte';
      default: return '';
    }
  }

  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(this.email);
    const isPasswordValid = this.password.length >= 8;
    const passwordsMatch = this.password === this.confirmPassword;
    return isEmailValid && isPasswordValid && passwordsMatch && this.acceptTerms;
  }
}
