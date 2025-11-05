import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  }

  handleGoogleLogin(): void {
    console.log('Inicio de sesión con Google');
    
    // Aquí integrarás Google OAuth
    // Ejemplo con Angular Google Sign-In:
    // this.authService.signInWithGoogle().subscribe({
    //   next: (response) => {
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (error) => {
    //     console.error('Error con Google:', error);
    //   }
    // });

    alert('Redirigiendo a Google...');
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