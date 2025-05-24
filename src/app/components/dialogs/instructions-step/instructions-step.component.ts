import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ResultComponent } from '../result/result.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TruncatePipe } from 'app/truncate.pipe';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructions-step',
  standalone: true,
  imports: [CommonModule,TruncatePipe,TranslocoModule,MaterialModuleModule,FormsModule],
  templateUrl: './instructions-step.component.html',
  styleUrl: './instructions-step.component.scss'
})
export class InstructionsStepComponent {
    @Input() step
    @Input() stepBack
    constructor(
        public config: ConfigService,
          public rest: RestDataApiService, 
          private dialog: MatDialog,
          public dialogRef: MatDialogRef<InstructionsStepComponent>,
           @Inject(MAT_DIALOG_DATA) public data: any
        ) { 
            this.step = data.step;
            this.stepBack = data.stepBack;
        }
  
    ngOnInit(): void {
      console.log(this.step)
    }
  
    annotation: any;
    loadingAnnotaion = true
  
    loadVoice(etp) {
        this.rest.loadAudio(this.step.courrier.id, etp.id).subscribe((r) => {
          if (r["data"]) {
            const data = r["data"];
            r["res"]["voiceAnnotation"] = data;
          }
      
          r = r["res"];
          if (r) this.annotation = {};
      
          const dialogRef = this.dialog.open(ResultComponent, {
            disableClose: true,
            autoFocus: true,
            data: {
              text: r['isVoice'] ? r['voiceAnnotation'] : r['commentaire'],
              isVoice: r['isVoice'],
              fromStep: true,
              etat: 2,
              name: r['user']['fullName'],
              title: this.config.c.doStep.appro + ""
            }
          });
      
          this.annotation['text'] = r['isVoice'] ? r['voiceAnnotation'] : r['commentaire'];
          this.annotation['isVoice'] = r['isVoice'];
          this.annotation['fromStep'] = true;
          this.annotation['etat'] = 2;
          this.annotation['name'] = r['user']['fullName'];
          this.annotation['title'] = this.config.c.doStep.appro + "";
      
          setTimeout(() => {
            this.loadingAnnotaion = false;
          }, 400);
        });
      }

      onClose(){
        this.dialogRef.close()
      }
}
