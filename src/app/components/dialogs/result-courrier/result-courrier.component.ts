import { Component, Inject, Input ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-result-courrier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-courrier.component.html',
  styleUrl: './result-courrier.component.scss'
})
export class ResultCourrierComponent implements OnInit {
    @Input() text
    @Input() title
    constructor(
        public dialogRef: MatDialogRef<ResultCourrierComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string }
      ) {
        this.text = data.title;
        this.title = data.title;
      }
    ngOnInit(): void {
    }

      onClose(): void {
        this.dialogRef.close();
      }
}
