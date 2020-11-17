import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Auth} from '../models/auth';
import {DataResponse} from '../models/response';
import { User } from '../models/user';

const httpOptions = {
  withCredentials: true,
  headers: new HttpHeaders({
    'Contend-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthApiService{

  url: string = 'https://localhost:44312/api/user';
  private refreshTokenTimeout;

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  public get userData(): User{
    return this.userSubject.value;
  }

  constructor(private http: HttpClient){
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  authenticate(auth: Auth): Observable<DataResponse>{
    return this.http.post<DataResponse>(`${this.url}/login`, auth, httpOptions).pipe(map(res => {
      if (res.success === 1){
        const user: User = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
      }
      return res;
    }));
  }

  logout(): void{
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.stopRefreshTokenTimeout();
  }

  refreshToken(): Observable<DataResponse>{
    return this.http.post<DataResponse>(`${this.url}/refresh-token`, {}, httpOptions).pipe(
      map((res) => {
        if (res.success === 1){
          const user: User = res.data;
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
        }
        return res;
      }));
  }

  startRefreshTokenTimer(): void{
    // Obtenemos la informacion del jwt
    const jwtToken = JSON.parse(atob(this.userData.token.split('.')[1]));

    // establece un tiempo de espera un minuto antes de que expire
    const expire = new Date(jwtToken.exp * 1000);
    const timeout = expire.getTime() - Date.now() - (60 * 1000);

    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  stopRefreshTokenTimeout(): void{
    clearTimeout(this.refreshTokenTimeout);
  }
}
