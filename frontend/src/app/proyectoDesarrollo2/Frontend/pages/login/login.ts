import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isHovered: boolean = false;

  constructor(private router: Router) {}

  handleSubmit(): void {
    console.log('Login attempt:', {
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    });

    // Validación básica
    if (!this.username || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Aquí conectarás tu lógica de autenticación
    alert(`Bienvenido, ${this.username}!`);
    // Después del login exitoso, podrías redirigir al dashboard:
    // this.router.navigate(['/dashboard']);
  }

  handleGoogleLogin(): void {
    console.log('Inicio de sesión con Google');
    alert('Redirigiendo a Google...');
  }

  handleRegister(): void {
    console.log('Navegando a registro...');
    this.router.navigate(['/registro']);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}