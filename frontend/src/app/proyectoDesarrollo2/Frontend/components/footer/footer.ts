import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',               // <--- cambia a app-footer
  standalone: true,                      // obligatorio para standalone
  templateUrl: './footer.html', 
  styleUrls: ['./footer.scss'], 
  imports: [CommonModule]               // módulos que necesita
})
export class Footer { }                  // <--- nombre de la clase Footer
