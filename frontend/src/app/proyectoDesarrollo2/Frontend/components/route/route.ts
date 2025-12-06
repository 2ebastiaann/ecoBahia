import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface RouteData {
  nombre: string;
  descripcion: string;
  zonaAsignada: string;
  color: string;
}

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './route.html',
  styleUrls: ['./route.scss']
})
export class CreateRouteComponent {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() startDraw = new EventEmitter<RouteData>();

  data: RouteData = {
    nombre: '',
    descripcion: '',
    zonaAsignada: '',
    color: '#2563eb'
  };

  startDrawing() {
    console.log("🔥 Ejecutando startDrawing", this.data);
    this.startDraw.emit(this.data);
    this.close.emit();
    this.isOpen = false;
  }
}
