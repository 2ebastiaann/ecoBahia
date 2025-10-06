import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',   // este es el nombre que usarás en HTML
  standalone: true,          // <--- clave para poder usarlo en otros componentes
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  imports: [CommonModule]    // módulos que necesita
})
export class Header { }       // <--- el nombre de la clase es Header
