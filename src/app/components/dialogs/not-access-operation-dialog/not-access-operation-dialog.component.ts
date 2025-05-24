import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-not-access-operation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-access-operation-dialog.component.html',
  styleUrl: './not-access-operation-dialog.component.scss'
})
export class NotAccessOperationDialogComponent {
    @Input() text: string
    @Input() etat: number
    @Input() title: string
    @Output()redirect=new EventEmitter<any>();

    constructor(
        public dialogRef: MatDialogRef<NotAccessOperationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; etat: number; text: string }) {
            this.title = data.title;
            this.etat = data.etat;
            this.text = data.text;
        }

        onClose(): void {
            // Emit the redirect event
            this.redirect.emit('ok');
            // Close the dialog
            this.dialogRef.close();
          }

}
