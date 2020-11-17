import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Task} from '../models/task';
import { DataResponse } from '../models/response';

const httpOptions = {
  headers: new HttpHeaders({
    'Contend-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {

  url: string = 'https://localhost:44312/api/task';

  constructor(private http: HttpClient) { }

  getAllUncompleted(): Observable<DataResponse>{
    return this.http.get<DataResponse>(`${this.url}/tasks-uncompleted`);
  }

  getAllCompleted(): Observable<DataResponse>{
    return this.http.get<DataResponse>(`${this.url}/tasks-completed`);
  }

  add(task: Task): Observable<DataResponse>{
    return this.http.post<DataResponse>(this.url, task, httpOptions);
  }

  edit(task: Task): Observable<DataResponse>{
    return this.http.put<DataResponse>(this.url, task, httpOptions);
  }

  delete(id: number): Observable<DataResponse>{
    return this.http.delete<DataResponse>(`${this.url}/${id}`, httpOptions);
  }
}
