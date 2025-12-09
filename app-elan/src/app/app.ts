import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Footer} from './footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Navbar, Footer],
  template: `
    @if (!isLoginPage) {
      <app-navbar></app-navbar>
    }

    <router-outlet></router-outlet>

    @if (!isLoginPage) {
      <app-footer></app-footer>
    }
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    router-outlet + * {
      flex: 1;
    }
  `]
})
export class AppComponent {
  title = 'ÉLAN - Galería de Arte';
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/inicio' || event.url === '/';
    });
  }
}
