import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { TaskApiService } from '../../../services/task-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {

  form = this.formBuilder.group({
    description: ['', Validators.required],
    date: ['', Validators.required],
  });


  constructor(
    private formBuilder: FormBuilder,
    private taskApi: TaskApiService,
    private sharedApi: SharedApiService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  addTask(): void {
    this.taskApi.add(this.form.value).subscribe((res) => {
      if (res.success === 1) {
        this.form.reset();
        this.sharedApi.sendEventClick();
        this.snackbar.open('Task added successfully.', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}
