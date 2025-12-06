import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],  // <-- importante
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Input() activeSection = 'inicio';
  @Input() menuItems: MenuItem[] = [];
  
  @Output() sectionChange = new EventEmitter<string>();
  @Output() logoutClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  setActiveSection(section: string): void {
    this.sectionChange.emit(section);
  }

  logout(): void {
    this.logoutClick.emit();
  }

  navigateTo(item: MenuItem): void {
    this.setActiveSection(item.id); // marca el item como activo
    // Navegación simple usando rutas
    switch(item.id) {
      case 'vehiculos':
        this.router.navigate(['/main', 'vehiculos']);
        break;
      case 'main':
        this.router.navigate(['/main']);
        break;
      case 'rutas':
        this.router.navigate(['/mapa']);
        break;
      default:
        this.router.navigate(['/main']);
        break;
    }
  }
}
