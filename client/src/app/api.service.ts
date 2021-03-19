import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataEntry } from './data-entry';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Logging } from './logging';
import { Sensor } from './sensors/sensor';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiURL = "http://localhost:8080/api/v0/";

  constructor(private http: HttpClient) { }

  getSensorData(id: string): Observable<DataEntry[]> {
    let url: string = this.apiURL+`sensor/${id}/data`;
    if (!environment.production) { Logging.log(url); }
    return this.http.get<DataEntry[]>(url)
      .pipe(
        tap(_ => Logging.log('fetched sensor data')),
        catchError(this.handleError<DataEntry[]>('getSensorData',[]))
      );
  }

  // []Sensor, sensors.go
  getSensors(): Observable<any[]> {
    let url: string = this.apiURL+"sensor";
    if (!environment.production) { Logging.log(url); }
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError<any[]>('getSensors',[]))
      );
  }

  // Sensor, sensors.go
  async getSensor(id: string): Promise<any> {
    let url: string = this.apiURL+"sensor";
    if (!environment.production) { Logging.log(url); }
    const data = await this.http.get<any[]>(url).toPromise()
    for (let i = 0; i < data.length; i++) {
      if (data[i].ID == id) {
        let ret = new Sensor(null,data[i].ID,data[i].RoomID);
        if (!environment.production) { Logging.log("[getSensor] Got item: "+data[i]); }
        return ret;
      }
    }
    return null;
  }

  private handleError<T>(operation='operation',result?: T) {
    return (error: any): Observable<T> => {
      Logging.log(error); // log to console
      Logging.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
