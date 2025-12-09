import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  mostrarModal: boolean = false;
  mostrarDetalle: boolean = false;
  cargando: boolean = true;
  filtroTexto: string = '';

  formulario: Cliente = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: ''
  };

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.cargando = false;
        alert('Error al cargar los clientes');
      }
    });
  }

  filtrarClientes(): void {
    const filtro = this.filtroTexto.toLowerCase().trim();

    if (!filtro) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente => {
      const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
      const email = cliente.email.toLowerCase();
      const ciudad = cliente.ciudad?.toLowerCase() || '';
      const pais = cliente.pais?.toLowerCase() || '';

      return nombreCompleto.includes(filtro) ||
             email.includes(filtro) ||
             ciudad.includes(filtro) ||
             pais.includes(filtro);
    });
  }

  limpiarFiltro(): void {
    this.filtroTexto = '';
    this.clientesFiltrados = this.clientes;
  }

  abrirModal(): void {
    this.mostrarModal = true;
    this.clienteSeleccionado = null;
    this.limpiarFormulario();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.clienteSeleccionado = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.formulario = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: ''
    };
  }

  editarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.formulario = { ...cliente };
    this.mostrarModal = true;
  }

  guardarCliente(): void {
    if (!this.formulario.nombre || !this.formulario.apellido || !this.formulario.email) {
      alert('Por favor completa los campos obligatorios (Nombre, Apellido y Email)');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formulario.email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    if (this.clienteSeleccionado && this.clienteSeleccionado.id) {
      // Actualizar
      this.clientesService.updateCliente(this.clienteSeleccionado.id, this.formulario).subscribe({
        next: () => {
          alert('Cliente actualizado exitosamente');
          this.cargarClientes();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert('Error al actualizar el cliente');
        }
      });
    } else {
      // Crear nuevo
      this.clientesService.createCliente(this.formulario).subscribe({
        next: () => {
          alert('Cliente creado exitosamente');
          this.cargarClientes();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al crear:', error);
          alert('Error al crear el cliente');
        }
      });
    }
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clientesService.deleteCliente(id).subscribe({
        next: () => {
          alert('Cliente eliminado exitosamente');
          this.cargarClientes();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          alert('Error al eliminar el cliente. Puede que tenga ventas asociadas.');
        }
      });
    }
  }

  verDetalle(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.mostrarDetalle = true;
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.clienteSeleccionado = null;
  }

  editarDesdeDetalle(): void {
    this.cerrarDetalle();
    if (this.clienteSeleccionado) {
      this.editarCliente(this.clienteSeleccionado);
    }
  }
}
