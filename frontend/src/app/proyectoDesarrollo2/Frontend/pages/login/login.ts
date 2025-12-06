import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isHovered: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  handleSubmit(): void {
    if (!this.email || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: res => {
        if (res.ok) {
          this.authService.guardarToken(res.token);
          alert(`Bienvenido, ${res.usuario.email}!`);
          this.router.navigate(['/main']);
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: err => {
        console.error('Error en login:', err);
        alert('Error al iniciar sesión');
      }
    });
  }

  handleGoogleLogin(): void {
    console.log('Inicio de sesión con Google');
    alert('Redirigiendo a Google...');
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
