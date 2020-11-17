import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { TaskApiService } from 'src/app/services/task-api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  dataSource: MatTableDataSource<Task>;
  displayedColumns: string[] = ['description', 'date', 'completed', 'actions'];
  clickEventSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private taskApi: TaskApiService,
    private sharedApi: SharedApiService,
    private snackbar: MatSnackBar
  ) {
    this.clickEventSubscription = this.sharedApi
      .getEventClick()
      .subscribe(() => {
        this.getAllTaskUncompleted();
      });
  }

  ngOnInit(): void {
    this.getAllTaskUncompleted();
  }

  getAllTaskUncompleted(): void {
    this.taskApi.getAllUncompleted().subscribe((res) => {
      if (res.success === 1) {
        this.dataSource = new MatTableDataSource<Task>(res.data);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  getAllTaskCompleted(event): void{
    if (event.checked === true){
      this.taskApi.getAllCompleted().subscribe((res) => {
        if (res.success === 1){
          this.dataSource = new MatTableDataSource<Task>(res.data);
          this.dataSource.paginator = this.paginator;
        }
      });
    } else{
      this.getAllTaskUncompleted();
    }
  }

  editTask(task: Task, event): void {
    if (event.checked === true){
      task.completed = true;
    }else{
      task.completed = false;
    }
    this.taskApi.edit(task).subscribe(res => {
      if (res.success === 1){
        this.getAllTaskUncompleted();
      }
    });
  }

  deleteTask(task: Task): void{
    this.taskApi.delete(task.id).subscribe(res => {
      if (res.success === 1){
        this.getAllTaskUncompleted();
        this.snackbar.open('Task deleted success.', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}
