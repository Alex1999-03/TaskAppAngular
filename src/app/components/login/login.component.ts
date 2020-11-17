import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private authApi: AuthApiService, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void{
    this.authApi.authenticate(this.loginForm.value).subscribe(res => {
      if (res.success === 1){
        this.router.navigate(['/task']);
      }
    });
  }
}
