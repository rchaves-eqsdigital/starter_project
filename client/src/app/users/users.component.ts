import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { Logging } from '../logging/logging';
import { User } from '../data-structs/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @Input()
  users: User[] = [];
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getUsers()
        .subscribe((data) => {
          if (!environment.production) { Logging.log("[users] Got data with len "+data.length); }
          for (let i = 0; i < data.length; i++) {
            data[i] = new User(null,data[i].Name,data[i].Email,data[i].ID);
          }
          this.users = data;
        });
  }

}
