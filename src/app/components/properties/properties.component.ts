import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PropertiesModel } from '../../Model/properties';
import { PropertiesService } from '../../services/properties.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router, TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    CheckboxModule,
    RadioButtonModule,
    CommonModule,
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css',
})
export class PropertiesComponent implements OnInit {
  filteredPropertiesList: PropertiesModel[] = [];
  uniqueCities: string[] = [];
  searchTerm: string = '';
  selectedFilter: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000000;
  selectedItems: string[] = [];
  showFavorites: boolean = false;

  propertiesList: PropertiesModel[] = [];
  editMode: boolean = false;
  previewVisible: boolean = false;
  properties: PropertiesModel = {
    city: '',
    name: '',
    shared: '',
    location: '',
    image: '',
    discription: '',
    detailes: '',
    rent: 0,
    furnished: '',
    favorite: false,
    amenities: [],
  };

  visible: boolean = false;
  selectedFile: File | null = null;

  showDialog() {
    this.visible = true;
  }
  closeDialog() {
    this.visible = false;
  }
  showPreview() {
    this.previewVisible = true; // Show the preview dialog
  }

  closePreviewDialog() {
    this.previewVisible = false; // Close the preview dialog
  }

  cityList: string[] = ['bengalore', 'mysore', 'tumkur', 'birur'];
  amenitiesOptions: string[] = ['Gym', 'Pool', 'Parking'];

  isAdmin: boolean = false;
  constructor(private _propertieService: PropertiesService) {}
  private messageService = inject(MessageService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getPropertiesList();
    const loggedInEmail = sessionStorage.getItem('email');
    const adminEmail = 'user1@gmail.com';

    this.isAdmin = loggedInEmail === adminEmail;
  }
  trackByIndex(index: number, item: any): number {
    return item.id;
  }
  getPropertiesList() {
    this._propertieService.getProperties().subscribe((res) => {
      this.propertiesList = res;
      this.filteredPropertiesList = res;
      this.getUniqueCities();
    });
  }

  toggleFavorite(item: PropertiesModel) {
    item.favorite = !item.favorite;
    this._propertieService.updatePropertie(item).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Favorite status updated successfully',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update favorite status',
        });
      }
    );
  }

  getUniqueCities() {
    this.uniqueCities = [
      ...new Set(this.propertiesList.map((item) => item.city.toLowerCase())),
    ];
  }

  updateFilteredProperties() {
    this.filteredPropertiesList = this.propertiesList.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesCity = this.selectedFilter
        ? item.city === this.selectedFilter
        : true;
      const matchesPrice =
        item.rent >= this.minPrice && item.rent <= this.maxPrice;
      const matchesItems = this.selectedItems.length
        ? this.selectedItems.includes(item.shared)
        : true;
      const matchesFavorites = this.showFavorites ? item.favorite : true;

      return (
        matchesSearch &&
        matchesCity &&
        matchesPrice &&
        matchesItems &&
        matchesFavorites
      );
    });
  }

  onShowFavoritesChange() {
    this.updateFilteredProperties(); // Refresh the list based on favorite status
  }

  onSearchOrFilterChange() {
    this.updateFilteredProperties();
  }

  onItemSelect(item: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter((i) => i !== item);
    }
    this.updateFilteredProperties();
  }
  // onSubmit(form: NgForm): void {
  //   if (form.valid) {
  //     this._propertieService.addPropertie(this.properties).subscribe((res) => {
  //       this.propertiesList.push(res);
  //       this.updateFilteredProperties();
  //       form.reset();
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'New property added successfully',
  //       });
  //     });
  //   }
  // }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.properties.image = reader.result as string; // Store the image as a Base64-encoded string
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.editMode) {
        // Update existing property
        this._propertieService
          .updatePropertie(this.properties)
          .subscribe((res) => {
            // Find and update the property in the list
            const index = this.propertiesList.findIndex((p) => p.id === res.id);
            if (index !== -1) {
              this.propertiesList[index] = res;
            }
            this.updateFilteredProperties();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Property updated successfully',
            });
            this.editMode = false;
            form.reset();
            this.visible = false;
          });
      } else {
        // Add new property
        this._propertieService
          .addPropertie(this.properties)
          .subscribe((res) => {
            this.propertiesList.push(res);
            this.updateFilteredProperties();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'New property added successfully',
            });
            form.reset();
            this.visible = false;
          });
      }
    }
  }

  getDetails(id: number): void {
    this.router.navigate(['/propertiesDetails', id.toString()]);
  }

  hoverEdit: boolean = false;
  hoverDelete: boolean = false;

  editItem(propertiesData: PropertiesModel) {
    this.properties = propertiesData;
    this.visible = true;
    this.editMode = true;
  }

  deleteItem(id?: number): void {
    if (id !== undefined) {
      this._propertieService.deletePropertie(id).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New property added successfully',
        });
        this.getPropertiesList();
      });
      console.log('Delete item with ID:', id);
    } else {
      console.error('ID is undefined, cannot delete item.');
    }
  }

  currentPage = 1;
  itemsPerPage = 4;
  get paginatedPropertiesList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPropertiesList.slice(start, end);
  }

  // Compute the total number of pages
  get totalPages() {
    return Math.ceil(this.filteredPropertiesList.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
