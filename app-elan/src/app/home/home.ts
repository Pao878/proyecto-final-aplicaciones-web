import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  carouselImages = [
    {
      src: 'assets/imagenes/carrusel1.jpg',
      alt: 'Galería ÉLAN - Arte Contemporáneo',
      title: 'Bienvenidos a ÉLAN',
      description: 'Espacio dedicado a celebrar el arte contemporáneo y la creatividad'
    },
    {
      src: 'assets/imagenes/carrusel2.jpg',
      alt: 'Exposiciones de Arte',
      title: 'Exposiciones Exclusivas',
      description: 'Donde cada obra encuentra su lugar'
    },
    {
      src: 'assets/imagenes/carrusel3.jpg',
      alt: 'Colección de Obras',
      title: 'Colección Única',
      description: 'Descubre las mejores obras de arte contemporáneo'
    }
  ];

  directivos = [
    {
      imagen: 'assets/imagenes/Directivos/directora.jpg',
      cargo: 'Directora',
      nombre: 'Valentina Moreau',
      descripcion: 'Posee más de una década de experiencia en gestión cultural y dirección de espacios artísticos. Su visión combina elegancia, innovación y un profundo compromiso con la promoción del talento emergente.'
    },
    {
      imagen: 'assets/imagenes/Directivos/curador.jpg',
      cargo: 'Curador',
      nombre: 'Elías Montreux',
      descripcion: 'Es un curador especializado en arte contemporáneo, reconocido por su enfoque narrativo y su habilidad para crear exposiciones con un fuerte impacto visual y conceptual.'
    },
    {
      imagen: 'assets/imagenes/Directivos/administradora.jpg',
      cargo: 'Administradora',
      nombre: 'Gabriela Solís',
      descripcion: 'Cuenta con amplia experiencia en administración de proyectos culturales, logística de exposiciones y gestión operativa de espacios artísticos.'
    }
  ];
}
