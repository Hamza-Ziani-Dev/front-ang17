import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'app/components/services/config.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-close-confirmation',
    standalone: true,
    imports: [CommonModule, TranslocoModule, MaterialModuleModule, FormsModule],
    templateUrl: './close-confirmation.component.html',
    styleUrl: './close-confirmation.component.scss',
})
export class CloseConfirmationComponent {
    @Output() etat: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        public config: ConfigService,
        public dialogRef: MatDialogRef<CloseConfirmationComponent>
    ) {}

    ngOnInit(): void {}
    action(a) {
        this.etat.emit(a);
        this.dialogRef.close();
    }
}
