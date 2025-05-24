import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-result-edit-courrier-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-edit-courrier-dialog.component.html',
  styleUrl: './result-edit-courrier-dialog.component.scss'
})
export class ResultEditCourrierDialogComponent {
    @Input() text
    @Input() title
    constructor(
        public dialogRef: MatDialogRef<ResultEditCourrierDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string;}
      ) {
        this.title = data.title;
        this.text = data.text;
      }
}
