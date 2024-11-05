import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PropertiesService } from '../../services/properties.service';
import { PropertiesModel } from '../../Model/properties';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        {
          provide: PropertiesService,
          useValue: { getProperties: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: Check component creation
  fit('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
