import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-non-connection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './non-connection.component.html',
  styleUrl: './non-connection.component.scss'
})
export class NonConnectionComponent {
    title : string;
    message : string;
    constructor(
        public dialogRef: MatDialogRef<NonConnectionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.title = data.title;
        this.message = data.message;
    }


    close(){
        this.dialogRef.close();
    }

}
