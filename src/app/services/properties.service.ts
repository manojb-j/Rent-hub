import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { CommentModel, PropertiesModel } from '../Model/properties';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private apiUrl = 'http://localhost:3000/properties';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<PropertiesModel[]> {
    return this.http.get<PropertiesModel[]>(this.apiUrl);
  }
  getPropertyById(id: number): Observable<PropertiesModel> {
    return this.http.get<PropertiesModel>(`${this.apiUrl}/${id}`);
  }

  addPropertie(propertie: PropertiesModel): Observable<PropertiesModel> {
    return this.http.post<PropertiesModel>(this.apiUrl, propertie);
  }
  updatePropertie(propertie: PropertiesModel): Observable<PropertiesModel> {
    return this.http.put<PropertiesModel>(
      `${this.apiUrl}/${propertie.id}`,
      propertie
    );
  }

  deletePropertie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addCommentToProperty(
    propertyId: number,
    comment: CommentModel
  ): Observable<PropertiesModel> {
    return this.getPropertyById(propertyId).pipe(
      switchMap((property) => {
        const updatedProperty = {
          ...property,
          comments: [...(property.comments || []), comment],
        };
        return this.updatePropertie(updatedProperty);
      })
    );
  }
}
