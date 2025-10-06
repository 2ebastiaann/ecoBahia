import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa tus componentes reutilizables
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

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
    // Ejemplo:
    // this.authService.login(this.username, this.password).subscribe({
    //   next: (response) => {
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (error) => {
    //     console.error('Error de autenticación:', error);
    //   }
    // });

    alert(`Bienvenido, ${this.username}!`);
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