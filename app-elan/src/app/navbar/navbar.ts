import { Component } from '@angular/core';
import{RouterLinkActive, RouterLink, Router} from '@angular/router'

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

}
