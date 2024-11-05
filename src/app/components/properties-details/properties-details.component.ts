import { Component, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertiesService } from '../../services/properties.service';
import { CommentModel, PropertiesModel } from '../../Model/properties';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-properties-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    RadioButtonModule,
    DialogModule,
  ],
  templateUrl: './properties-details.component.html',
  styleUrl: './properties-details.component.css',
})
export class PropertiesDetailsComponent implements OnInit {
  propertyId: number | null = null;
  propertyDetails: PropertiesModel | null = null;
  newComment: string = ''; // To store new comment text
  username: string = 'Guest'; // Set or retrieve username for comments

  constructor(
    private route: ActivatedRoute,
    private _propertiesService: PropertiesService
  ) {}
  private messageService = inject(MessageService);

  ngOnInit(): void {
    // Get the 'id' parameter from the route
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id'); // This can be null
      if (idParam) {
        this.propertyId = +idParam; // Convert to number if not null
        this.loadPropertyDetails(this.propertyId); // Load details using the id
      } else {
        console.error('No ID parameter found'); // Handle the case where no ID is found
      }
    });
  }
  loadPropertyDetails(id: number): void {
    // Call the service method to get the property details by ID
    this._propertiesService.getPropertyById(id).subscribe(
      (property) => {
        this.propertyDetails = property; // Assign the fetched property to the component variable
      },
      (error) => {
        console.error('Failed to load property details', error);
      }
    );
  }

  onEnquiry() {
    this.messageService.add({
      severity: 'success',
      summary: 'message sent Successfully',
      detail: 'Soon the owner will contact you',
    });
  }

  addComment(): void {
    if (this.newComment.trim() && this.propertyId !== null) {
      const comment: CommentModel = {
        user: this.username,
        text: this.newComment,
        date: new Date().toISOString(),
      };

      this._propertiesService
        .addCommentToProperty(this.propertyId, comment)
        .subscribe(
          (updatedProperty) => {
            this.propertyDetails = updatedProperty;
            this.newComment = ''; // Clear the comment input
          },
          (error) => {
            console.error('Failed to add comment', error);
          }
        );
    }
  }
}
