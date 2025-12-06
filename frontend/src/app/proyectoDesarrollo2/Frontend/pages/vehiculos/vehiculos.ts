// vehiculos.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Vehiculo {
  id?: string;
  placa: string;
  marca: string;
  modelo: string;
  activo: boolean;
}

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.html',
  styleUrls: ['./vehiculos.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class VehiculosComponent implements OnInit {

  vehicles: Vehiculo[] = [];
  vehicleForm: FormGroup;
  showModal = false;
  isEditMode = false;
  selectedVehicle?: Vehiculo;

  //Perfi ID
  private readonly PERFIL_ID = 'c11bebca-c05b-4a58-afe0-cf280b686365';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.vehicleForm = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      activo: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.api.getVehiculos().subscribe({
      next: (res: any) => {
        this.vehicles = res.data || [];
      },
      error: (err: any) => {
        console.error('Error cargando vehículos:', err);
        alert('No se pudieron cargar los vehículos');
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.vehicleForm.reset({ activo: true });
    this.showModal = true;
  }

  editVehicle(vehicle: Vehiculo): void {
    this.isEditMode = true;
    this.selectedVehicle = vehicle;
    this.vehicleForm.patchValue(vehicle);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.vehicleForm.reset({ activo: true });
    this.selectedVehicle = undefined;
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) return;

    const vehiculoData = {
      ...this.vehicleForm.value,
      perfil_id: this.PERFIL_ID
    };

    if (this.isEditMode && this.selectedVehicle?.id) {
      this.api.actualizarVehiculo(this.selectedVehicle.id, vehiculoData).subscribe({
        next: (res: any) => {
          alert('Vehículo actualizado correctamente');
          this.closeModal();
          this.loadVehicles();
        },
        error: (err: any) => {
          console.error('Error actualizando vehículo:', err);
          alert('Error al actualizar el vehículo');
        }
      });
    } else {
      this.api.crearVehiculo(vehiculoData).subscribe({
        next: (res: any) => {
          alert('Vehículo creado correctamente');
          this.closeModal();
          this.loadVehicles();
        },
        error: (err: any) => {
          console.error('Error creando vehículo:', err);
          alert('Error al crear el vehículo');
        }
      });
    }
  }

  deleteVehicle(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este vehículo?')) return;

    this.api.eliminarVehiculo(id).subscribe({
      next: (res: any) => {
        alert('Vehículo eliminado correctamente');
        this.loadVehicles();
      },
      error: (err: any) => {
        console.error('Error eliminando vehículo:', err);
        alert('Error al eliminar el vehículo');
      }
    });
  }

  // NUEVO: método para volver al Main
  goToMain(): void {
    this.router.navigate(['/main']);
  }
}
