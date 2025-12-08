import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationContainerComponent } from '../../components/notification-container/notification-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationContainerComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isHovered: boolean = false;

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {}

  handleSubmit(): void {
    if (!this.email || !this.password) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: res => {
        if (res.ok) {
          this.authService.guardarToken(res.token);
          this.authService.guardarUsuario(res.usuario);

          this.notificationService.success('¡Bienvenido!');
          setTimeout(() => this.router.navigate(['/main']), 1500);
        } else {
          this.notificationService.error('Credenciales inválidas');
        }
      },
      error: err => {
        console.error('Error en login:', err);
        this.notificationService.error('Error al iniciar sesión');
      }
    });
  }

  handleGoogleLogin(): void {
    console.log('Inicio de sesión con Google');
    this.notificationService.info('Google Sign-In en desarrollo');
  }

  handleRegister(): void {
    this.router.navigate(['/registro']);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.handleSubmit();
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}
