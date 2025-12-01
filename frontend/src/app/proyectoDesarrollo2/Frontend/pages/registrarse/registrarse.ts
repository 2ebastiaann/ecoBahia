import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  handleSubmit(): void {
    console.log('Register attempt:', {
      email: this.email,
      password: this.password,
      acceptTerms: this.acceptTerms
    });

    // Validaciones
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

    // Aquí conectarás tu lógica de registro
    alert(`¡Registro exitoso! Bienvenido ${this.email}`);
    
    // Redirigir al login después del registro exitoso
    this.router.navigate(['/login']);
  }

  handleGoogleRegister(): void {
    console.log('Registro con Google');
    alert('Redirigiendo a Google para registro...');
  }

  handleBack(): void {
    console.log('Navegando de vuelta...');
    this.router.navigate(['/login']);
  }

  handleGoToLogin(): void {
    console.log('Navegando a login...');
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
    
    if (strength <= 2) {
      this.passwordStrength = 'weak';
    } else if (strength <= 4) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  getPasswordStrengthWidth(): string {
    switch (this.passwordStrength) {
      case 'weak':
        return '33%';
      case 'medium':
        return '66%';
      case 'strong':
        return '100%';
      default:
        return '0%';
    }
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak':
        return 'Débil';
      case 'medium':
        return 'Media';
      case 'strong':
        return 'Fuerte';
      default:
        return '';
    }
  }

  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(this.email);
    const isPasswordValid = this.password.length >= 8;
    const passwordsMatch = this.password === this.confirmPassword;
    const termsAccepted = this.acceptTerms;
    
    return isEmailValid && isPasswordValid && passwordsMatch && termsAccepted;
  }
}