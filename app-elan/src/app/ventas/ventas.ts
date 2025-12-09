import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../../services/ventas.service';
import { ObrasService } from '../../services/obras.service';
import { ClientesService } from '../../services/clientes.service';
import { Venta } from '../../models/venta.model';
import { Obra } from '../../models/obra.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.scss']
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  ventaSeleccionada: Venta | null = null;

  obrasDisponibles: Obra[] = [];
  clientes: Cliente[] = [];

  mostrarModal: boolean = false;
  mostrarDetalle: boolean = false;
  cargando: boolean = true;

  filtroTexto: string = '';
  filtroMetodo: string = 'todos';
  precioSugerido: number = 0;

  formulario: Venta = {
    obra_id: 0,
    cliente_id: 0,
    precio_venta: 0,
    fecha_venta: '',
    metodo_pago: 'efectivo',
    notas: ''
  };

  constructor(
    private ventasService: VentasService,
    private obrasService: ObrasService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Cargar todos los datos necesarios
  cargarDatos(): void {
    this.cargando = true;

    // Cargar obras, clientes y ventas en paralelo
    Promise.all([
      this.cargarObrasDisponibles(),
      this.cargarClientes()
    ]).then(() => {
      this.cargarVentas();
    }).catch(error => {
      console.error('Error al cargar datos:', error);
      this.cargando = false;
    });
  }

  cargarVentas(): void {
    this.ventasService.getVentas().subscribe({
      next: (data) => {
        // Asegurarnos de que cada venta tenga los nombres correctos
        this.ventas = data.map(venta => this.enriquecerVenta(venta));
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.cargando = false;
        alert('Error al cargar las ventas');
      }
    });
  }

  // Enriquecer venta con información de obra y cliente
  enriquecerVenta(venta: Venta): Venta {
    // Si ya tiene los nombres, no hacer nada
    if (venta.obra_titulo && venta.cliente_nombre) {
      return venta;
    }

    // Buscar la obra
    const obra = this.obrasDisponibles.find(o => o.id === venta.obra_id);
    if (obra) {
      venta.obra_titulo = obra.titulo;
    }

    // Buscar el cliente
    const cliente = this.clientes.find(c => c.id === venta.cliente_id);
    if (cliente) {
      venta.cliente_nombre = `${cliente.nombre} ${cliente.apellido}`.trim();
    }

    return venta;
  }

  cargarObrasDisponibles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.obrasService.getObras().subscribe({
        next: (data) => {
          // Guardar TODAS las obras para poder mostrar nombres en ventas
          this.obrasDisponibles = data.filter(obra => obra.estado === 'disponible');
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar obras:', error);
          reject(error);
        }
      });
    });
  }

  cargarClientes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clientesService.getClientes().subscribe({
        next: (data) => {
          this.clientes = data;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar clientes:', error);
          reject(error);
        }
      });
    });
  }

  filtrarVentas(): void {
    this.aplicarFiltros();
  }

  filtrarPorMetodo(metodo: string): void {
    this.filtroMetodo = metodo;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.ventas];

    // Filtro por texto
    if (this.filtroTexto.trim()) {
      const filtro = this.filtroTexto.toLowerCase();
      resultado = resultado.filter(venta => {
        const obraTitulo = venta.obra_titulo?.toLowerCase() || '';
        const clienteNombre = venta.cliente_nombre?.toLowerCase() || '';
        const notas = venta.notas?.toLowerCase() || '';

        return obraTitulo.includes(filtro) ||
               clienteNombre.includes(filtro) ||
               notas.includes(filtro);
      });
    }

    // Filtro por método de pago
    if (this.filtroMetodo !== 'todos') {
      resultado = resultado.filter(venta => venta.metodo_pago === this.filtroMetodo);
    }

    this.ventasFiltradas = resultado;
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroMetodo = 'todos';
    this.aplicarFiltros();
  }

  calcularTotalVentas(): number {
    return this.ventas.reduce((total, venta) => total + (venta.precio_venta || 0), 0);
  }

  calcularTotalFiltrado(): number {
    return this.ventasFiltradas.reduce((total, venta) => total + (venta.precio_venta || 0), 0);
  }

  getMetodoPagoTexto(metodo: string): string {
    const metodos: { [key: string]: string } = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta',
      'transferencia': 'Transferencia'
    };
    return metodos[metodo] || metodo;
  }

  getMetodoPagoIcono(metodo: string): string {
    const iconos: { [key: string]: string } = {
      'efectivo': 'bi bi-cash',
      'tarjeta': 'bi bi-credit-card',
      'transferencia': 'bi bi-arrow-left-right'
    };
    return iconos[metodo] || 'bi bi-cash';
  }

  onObraSeleccionada(): void {
    if (this.formulario.obra_id) {
      const obra = this.obrasDisponibles.find(o => o.id === Number(this.formulario.obra_id));
      if (obra && obra.precio) {
        this.precioSugerido = obra.precio;
        this.formulario.precio_venta = obra.precio;
      }
    } else {
      this.precioSugerido = 0;
      this.formulario.precio_venta = 0;
    }
  }

  abrirModal(): void {
    if (this.obrasDisponibles.length === 0) {
      alert('No hay obras disponibles para vender');
      return;
    }
    if (this.clientes.length === 0) {
      alert('Primero debes registrar clientes');
      return;
    }

    this.mostrarModal = true;
    this.limpiarFormulario();

    // Establecer fecha actual por defecto
    const hoy = new Date();
    this.formulario.fecha_venta = hoy.toISOString().split('T')[0];
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.formulario = {
      obra_id: 0,
      cliente_id: 0,
      precio_venta: 0,
      fecha_venta: '',
      metodo_pago: 'efectivo',
      notas: ''
    };
    this.precioSugerido = 0;
  }

  guardarVenta(): void {
    if (!this.formulario.obra_id || !this.formulario.cliente_id ||
        !this.formulario.precio_venta || !this.formulario.fecha_venta) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (this.formulario.precio_venta <= 0) {
      alert('El precio de venta debe ser mayor a 0');
      return;
    }

    this.ventasService.createVenta(this.formulario).subscribe({
      next: () => {
        alert('Venta registrada exitosamente');
        this.cargarDatos(); // Recargar todo
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al crear venta:', error);
        alert('Error al registrar la venta. Verifica que la obra esté disponible.');
      }
    });
  }

  eliminarVenta(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta? La obra volverá a estar disponible.')) {
      this.ventasService.deleteVenta(id).subscribe({
        next: () => {
          alert('Venta eliminada exitosamente');
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          alert('Error al eliminar la venta');
        }
      });
    }
  }

  verDetalle(venta: Venta): void {
    this.ventaSeleccionada = venta;
    this.mostrarDetalle = true;
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.ventaSeleccionada = null;
  }
}
