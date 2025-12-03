import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
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
}
