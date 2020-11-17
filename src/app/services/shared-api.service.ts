import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SharedApiService{

  private subject = new Subject<any>();

  sendEventClick(): void{
    this.subject.next();
  }

  getEventClick(): Observable<any>{
    return this.subject.asObservable();
  }
}
