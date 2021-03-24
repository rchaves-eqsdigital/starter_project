import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

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
    let url: string = this.apiURL+"sensor?id="+id;
    if (!environment.production) { Logging.log(url); }
    const data = await this.http.get<any>(url).toPromise()
    let ret = new Sensor(null,data.ID,data.RoomID);
    if (!environment.production) { Logging.log("[getSensor] Got item: "+ret); }
    return ret;
  }

  edit(type: string, data:any): Promise<any> {
    return this.http.post(this.apiURL+type+"/edit",data).toPromise();
  }

  login(email: string, password: string): Promise<any> {
    let data = JSON.stringify({'email': email, 'password': password});
    return this.http.post(this.apiURL+"login",data).toPromise();
  }

  private handleError<T>(operation='operation',result?: T) {
    return (error: any): Observable<T> => {
      Logging.log(error); // log to console
      Logging.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
