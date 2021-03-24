import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SHA256 } from 'crypto-js';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });
  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    let password = SHA256(this.loginForm.value.password).toString();
    await this.apiService.login(this.loginForm.value.email, password);
  }
}
