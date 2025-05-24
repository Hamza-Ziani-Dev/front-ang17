import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { RestDataApiService } from '../../services/rest-data-api.service';
import { EditListDosService } from '../../services/edit-list-dos.service';
import { ConfirmeStepComponent } from '../confirme-step/confirme-step.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
    selector: 'app-abondonne-modal',
    standalone: true,
    imports: [CommonModule,TranslocoModule,MaterialModuleModule],
    templateUrl: './abondonne-modal.component.html',
    styleUrl: './abondonne-modal.component.scss',
})
export class AbondonneModalComponent implements OnInit {
    formgroup: FormGroup;
    isloading = false;
    @Output() pass: EventEmitter<any> = new EventEmitter();
    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private rest: RestDataApiService,
        private edit: EditListDosService
    ) {}

    ngOnInit(): void {
        this.formgroup = this.fb.group({
            commentaire: ['', Validators.required],
        });
    }

    next() {
  const dialogRef = this.dialog.open(ConfirmeStepComponent, {
    disableClose: true,
    data: {
      target: "Le flux sera finalisé après votre validation. Merci de valider",
      btn: "Valider"
    }
  });

  dialogRef.afterClosed().subscribe((r: string) => {
    if (r === 'yes') {
      this.pass.emit({ stat: 'yes', value: this.formgroup.value });
      this.dialog.closeAll();
    }
  });
}


    clear() {
        this.formgroup.controls['commentaire'].setValue('');
    }
}
