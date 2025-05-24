import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { InstructionMotifDialogComponent } from '../instruction-motif-dialog/instruction-motif-dialog.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { BackDetailsComponent } from '../back-details/back-details.component';
import { InstructionsStepComponent } from '../instructions-step/instructions-step.component';
import { TruncatePipe } from 'app/truncate.pipe';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-step-etat-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TruncatePipe,TranslocoModule],
  templateUrl: './step-etat-dialog.component.html',
  styleUrl: './step-etat-dialog.component.scss'
})
export class StepEtatDialogComponent implements OnInit{
    @Input() courrier;
    steps
    step;
    stepName:string="";
    constructor(
        private ref: ChangeDetectorRef,
        public config :ConfigService ,
        private rest: RestDataApiService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { courrier: any },
        private dialogRef: MatDialogRef<StepEtatDialogComponent>,
        private translocoService: TranslocoService,
    ) {
        this.courrier = data.courrier;
    }

    onClose() {
        this.dialogRef.close();
    }

//   ngAfterContentChecked()
//   {
//      var element = document.getElementById('stepper1')
//     this.ref.detectChanges();
//    if( element.scrollWidth > element.clientWidth)
//    {
//      this.scrollExist=true;
//    }
//    else{
//     this.scrollExist=false;

//    }


//   }
ngAfterContentChecked() {
    const element = document.getElementById('stepper1');
    if (!element) return;

    this.ref.detectChanges();

    this.scrollExist = element.scrollWidth > element.clientWidth;
  }


  ngAfterViewInit() {
    const element = document.getElementById('stepper1');
    if (!element) return;

    this.scrollExist = element.scrollWidth > element.clientWidth;
  }

// Inistruction :
instruction() {
    const dialogConfig = {
      disableClose: true,
      autoFocus: true,
    };
    const confRef = this.dialog.open(InstructionMotifDialogComponent, dialogConfig);
    confRef.componentInstance.courrier = this.courrier;
    confRef.componentInstance.steps = this.steps;
  }

    openModal(e: any): void {
        const dialogRef = this.dialog.open(BackDetailsComponent, {
          disableClose: true,
          data: {
            step: e,
            stepBack: this.steps[this.steps.indexOf(e) - 1]
          }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }
      openModal2(e: any): void {
        const dialogRef = this.dialog.open(InstructionsStepComponent, {
          disableClose: true,
          data: {
            step: e,
            stepBack: this.steps[this.steps.indexOf(e) - 1]
          }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }

    scrollExist:boolean=false;
    tr=-1213
    ngOnInit(): void {
      console.log('courrier',this.data?.courrier)
      this.rest.courrierSteps(this.data?.courrier?.id).subscribe(r => {
        console.log(r)
        this.steps = r;
        console.log(this.steps)
        this.steps.forEach(element => {
          const d: Date = new Date(element.dateFin)
          const d2: Date = new Date(element.dateTraitement)
          const d3:Date=new Date(element.dateDebut)
          const index = this.steps.indexOf(element)
          if (element.dateTraitement && element.dateDebut) {
            const d2: Date = new Date(element.dateTraitement)
           if(index!=0)
           {
           }
            if (d.getTime() - d2.getTime() >= 0 && element['etat'] == 1) {
              this.steps[index].etat = 1;
            }
            if (d.getTime() - d2.getTime() < 0 && element['etat'] == 1) {
              this.steps[index].etat = -1;
            }
          }
          else {
            if (d.getTime() - new Date().getTime() < 0 && element['etat'] == 0) {
              this.steps[index].etat = -2;
            }
            if (d.getTime() - new Date().getTime() > 0 && element['etat'] == 0 &&this.steps[index-1]!=-1) {
              this.steps[index].etat = 0;
             this.stepName=this.steps[index]['name'];

            }
          if(element.dateDebut==null)
            {
              this.steps[index].etat=3

            }

          }
        this.tr=0


        });
        var timeout = setTimeout(function()
        {
            //  $('#anime').remove();

             clearTimeout(timeout)
        },20000000);

        this.steps.forEach(element => {
          const index = this.steps.indexOf(element)

          if (element['etat'] == 0||element['etat'] == -2) {
           this.stepName=this.steps[index]['name'];
             }
        })
      })
    }



      closeDialog(): void {
        this.dialogRef.close();
      }

}
