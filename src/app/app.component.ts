import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './models/user';
import { AuthApiService } from './services/auth-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Task App';
  user: User;

  constructor(private authApi: AuthApiService, private router: Router){
    this.authApi.user.subscribe(res => {
      this.user = res;
    });
  }

  logout(): void{
    this.authApi.logout();
    this.router.navigate(['/login']);
  }
}
