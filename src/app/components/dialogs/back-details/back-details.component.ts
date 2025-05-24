import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-back-details',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule,FormsModule],
  templateUrl: './back-details.component.html',
  styleUrl: './back-details.component.scss'
})
export class BackDetailsComponent {
    @Input( )step
    @Input( )stepBack
    constructor(
        public config :ConfigService ,
         public dialogRef: MatDialogRef<BackDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.step = data.step;
        this.stepBack = data.stepBack;
      
    }
   
    stpName
    stpbName
    
      ngOnInit(): void {
       this.stpName='" '+this.step.name+' "'
       this.stpbName='" '+this.stepBack.name+' "'
    
    
      }
}
