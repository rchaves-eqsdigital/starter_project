import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataEntry } from './data-structs/data-entry';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Logging } from './logging/logging';
import { Sensor } from './data-structs/sensor';
import { User } from './data-structs/user';
import { CookieService } from 'ngx-cookie-service';

/**
 * Class exposing API services through HTTP.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private girlScouts: CookieService
  ) { }

  /**
   * Get data of a sensor.
   * 
   * @param id - Sensor ID to retrieve data of.
   * @returns Observable with DataEntry array.
   */
  public getSensorData(id: string): Observable<DataEntry[]> {
    let url: string = environment.apiURL+`sensor/${id}/data`;
    Logging.log(url);

    return this.http.get<DataEntry[]>(url, this.requestOptions())
      .pipe(
        tap(_ => Logging.log('fetched sensor data')),
        catchError(this.handleError<DataEntry[]>('getSensorData',[]))
      );
  }

  /**
   * Get complete list of sensors.
   * 
   * @returns Observable with Sensor array (directly from sensors.go Sensor struct).
   */
  public getSensors(): Observable<any[]> {
    let url: string = environment.apiURL+"sensor";
    Logging.log(url);

    return this.http.get<any[]>(url, this.requestOptions())
      .pipe(
        catchError(this.handleError<any[]>('getSensors',[]))
      );
  }

  /**
   * Get the sensor with the provided ID.
   * 
   * @param id - Sensor ID.
   * @returns Promise with a Sensor (directly from sensors.go Sensor struct).
   */
  public async getSensor(id: string): Promise<any> {
    let url: string = environment.apiURL+"sensor?id="+id;
    Logging.log(url);

    const data = await this.http.get<any>(url, this.requestOptions()).toPromise()
    let ret = new Sensor(null,data.ID,data.RoomID);
    Logging.log("[getSensor] Got item: "+ret);
    return ret;
  }

  /**
   * Get complete list of users.
   * 
   * @returns Observable with User array (directly from users.go User struct).
   */
  public getUsers(): Observable<any[]> {
    let url: string = environment.apiURL+"user";
    Logging.log(url);

    return this.http.get<any[]>(url, this.requestOptions())
      .pipe(
        catchError(this.handleError<any[]>('getUsers',[]))
      );
  }

  /**
   * Get the user with the provided ID.
   * 
   * @param id - User ID (the ID in the DB, not the email).
   * @returns Promise with a User (directly from users.go User struct).
   */
  public async getUser(id: string): Promise<any> {
    let url: string = environment.apiURL+"user?id="+id;
    Logging.log(url);

    const data = await this.http.get<any>(url, this.requestOptions()).toPromise()
    let ret = new User(null,data.Name,data.Email,id);
    Logging.log("[getUser] Got item: "+ret);
    return ret;
  }

    /**
   * Get the user with the provided partial token.
   * 
   * @param tok - First 8 chars of a user's session token.
   * @returns Promise with a User (directly from users.go User struct).
   */
     public async getUserFromTok(tok: string): Promise<any> {
      let url: string = environment.apiURL+"user?tok="+tok;
      Logging.log(url);
  
      const data = await this.http.get<any>(url, this.requestOptions()).toPromise()
      let ret = new User(null,data.Name,data.Email,data.ID);
      Logging.log("[getUser] Got item: "+ret);
      return ret;
    }

  /**
   * Edit a user's email or sensor's 
   * 
   * @param type - Data type to be edited. Currently supports `sensor` and `user`.
   * @param data - New value to be updated.
   * @returns Promise not used.
   */
  public edit(type: string, data:any): Promise<any> {
    return this.http.post(environment.apiURL+type+"/edit",data, this.requestOptions()).toPromise();
  }

  /**
   * Login a user by providing email and password.
   * 
   * @param email - User's email.
   * @param password - SHA256 hash of the user's password.
   * @returns Promise with the session token, to be stored in cookies["token"].
   */
  public login(email: string, password: string): Promise<any> {
    let data = JSON.stringify({'email': email, 'password': password});
    return this.http.post(environment.apiURL+"login",data, this.requestOptions()).toPromise();
  }

  /**
   * Logout from the current session, invalidating `token` in cookies.
   * 
   * @returns Promise with {ok: bool}, true if logout was successful.
   */
  public logout(): Promise<any> {
    let data = JSON.stringify({'token': this.girlScouts.get("token")});
    return this.http.post(environment.apiURL+"logout",data, this.requestOptions()).toPromise();
  }

  /**
   * Handle errors for the functions that return Observables.
   * 
   * @param operation - String with the function name where the error occurred.
   * @param result - Optional type.
   * @returns
   */
  private handleError<T>(operation='operation',result?: T) {
    return (error: any): Observable<T> => {
      Logging.log(error); // log to console
      Logging.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  /**
   * Get the cookie `token` and use its value for authorization in the
   * `Authorization` HTTP header.
   * 
   * @returns HTTP headers to be used in a request.
   */
  private requestOptions(): {headers: HttpHeaders} {
    return {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'Authorization': 'Basic '+this.girlScouts.get("token"),
      }),
    }
  }
}
