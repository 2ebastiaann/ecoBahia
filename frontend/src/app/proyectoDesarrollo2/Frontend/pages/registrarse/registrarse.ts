import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationContainerComponent } from '../../components/notification-container/notification-container.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationContainerComponent],
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

  // NUEVO → rol
  id_rol: number = 3; // usuario por defecto

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {}

  handleSubmit(): void {
    if (!this.isFormValid()) {
      this.notificationService.warning('Por favor completa todos los campos correctamente');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationService.warning('Las contraseñas no coinciden');
      return;
    }

    if (!this.acceptTerms) {
      this.notificationService.warning('Debes aceptar los términos y condiciones');
      return;
    }

    this.authService.register(this.email, this.password, this.id_rol).subscribe({
      next: res => {
        if (res.ok) {
          this.notificationService.success('¡Registro exitoso! Redirigiendo...');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.notificationService.error('Error al registrar. Intenta de nuevo.');
        }
      },
      error: err => {
        console.error('Error en registro:', err);
        this.notificationService.error('Error al registrar usuario');
      }
    });
  }

  handleGoogleRegister(): void {
    this.notificationService.info('Google Sign-Up en desarrollo');
  }

  handleBack(): void {
    this.router.navigate(['/login']);
  }

  handleGoToLogin(): void {
    this.router.navigate(['/login']);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.handleSubmit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(): void {
    const p = this.password;
    let strength = 0;

    if (p.length >= 8) strength++;
    if (p.length >= 12) strength++;
    if (/[A-Z]/.test(p)) strength++;
    if (/[a-z]/.test(p)) strength++;
    if (/\d/.test(p)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) strength++;

    if (strength <= 2) this.passwordStrength = 'weak';
    else if (strength <= 4) this.passwordStrength = 'medium';
    else this.passwordStrength = 'strong';
  }

  getPasswordStrengthWidth(): string {
    return this.passwordStrength === 'weak'
      ? '33%' : this.passwordStrength === 'medium'
      ? '66%' : '100%';
  }

  getPasswordStrengthText(): string {
    return this.passwordStrength === 'weak'
      ? 'Débil' : this.passwordStrength === 'medium'
      ? 'Media' : 'Fuerte';
  }

  isFormValid(): boolean {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    const passwordValid = this.password.length >= 8;
    const match = this.password === this.confirmPassword;
    return emailValid && passwordValid && match && this.acceptTerms;
  }
}
