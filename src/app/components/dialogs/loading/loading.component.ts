import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
    @Input() title;
    @Input() message;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}

}
