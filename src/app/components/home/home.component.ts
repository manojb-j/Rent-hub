import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PropertiesComponent } from '../properties/properties.component';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { PropertiesService } from '../../services/properties.service';
import { CommonModule } from '@angular/common';
import { PropertiesModel } from '../../Model/properties';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    PropertiesComponent,
    ToolbarModule,
    AvatarModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private _propertiesService = inject(PropertiesService);

  properties: PropertiesModel[] = [];
  filteredProperties: PropertiesModel[] = [];

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    this._propertiesService.getProperties().subscribe((res) => {
      console.log('Fetched Properties:', res);
      this.properties = res;
      this.filterProperties();
    });
  }

  filterProperties() {
    this.filteredProperties = this.properties.filter(
      (property) => property.rent >= 10000
    );
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
  toLogin() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
