import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-courier-tracking',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './courier-tracking.component.html',
  styleUrl: './courier-tracking.component.scss'
})
export class CourierTrackingComponent {
    reference = '2024160097';
  category = 'Depart Cadre';
  type = 'Courrier départ';
  process = 'Depart Cadre';
  steps = [
    { name: 'Cadre', status: 'completed' },
    { name: 'SV', status: 'pending' },
    { name: 'DP', status: 'pending' },
    { name: 'LK', status: 'completed' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CourierTrackingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

}
