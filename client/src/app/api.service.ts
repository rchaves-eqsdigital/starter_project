import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataEntry } from './data-entry';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiURL = "localhost:8080/api/v0/";

  // TODO: WIP

  constructor(private http: HttpClient) { }

  getSensorData(id: string): Observable<DataEntry[]> {
    let url: string = this.apiURL+`sensor/${id}/data`;
    console.log(url);
    return this.http.get<DataEntry[]>(url)
      .pipe(
        tap(_ => console.log('fetched sensor data')),
        catchError(this.handleError<DataEntry[]>('getSensorData',[]))
      );
  }

  private handleError<T>(operation='operation',result?: T){
    return (error: any): Observable<T> => {
      console.log(error); // log to console
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
