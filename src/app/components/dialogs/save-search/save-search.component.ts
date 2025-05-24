import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { ResultCourrierComponent } from '../result-courrier/result-courrier.component';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';


@Component({
    selector: 'app-save-search',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule
    ],
    template: `
        <div class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50" *transloco="let translate">
            <div class="relative mx-auto my-6 w-[30%]">
                <div
                    class="relative flex flex-col w-full bg-card  border-0 rounded-lg shadow-lg outline-none focus:outline-none"
                >
                    <div
                        class="flex items-center rounded-md justify-between px-2 py-1 bg-gray-50"
                    >
                        <h5 class="text-lg font-bold text-blue-900">
                            {{translate('common.enregister')}} :
                        </h5>
                        <button
                            (click)="dialogRef.close()"
                            class="text-gray-700 hover:text-black font-extrabold text-4xl leading-none px-2"
                        >
                            &times;
                        </button>
                    </div>

                    <!-- Line separator -->
                    <div class="h-1 bg-blue-500">
                        <div class="h-full bg-yellow-400 w-1/5"></div>
                    </div>
                    <!-- Dialog content -->
                    <div class="relative p-2 max-h-[90vh] overflow-y-auto">
                        <div class="p-4">
                            <label
                                for="searchName"
                                class="block text-md font-medium text-gray-700 mb-1"
                            >
                                 {{translate('common.nomrecharcher')}}
                            </label>
                            <input
                                id="searchName"
                                type="text"
                                [(ngModel)]="search.name"
                                class="w-full px-2 py-1 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autofocus
                                required
                            />

                            <div
                                *ngIf="validator"
                                class="mt-3 p-2 bg-red-100 text-red-700 rounded text-sm"
                            >
                                {{ validator }}
                            </div>
                        </div>

                        <!-- Dialog footer -->
                        <div class="flex justify-end gap-2 p-2 border-t-2">
                            <button
                                (click)="onCancel()"
                                class="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                            >
                                <i class="fas fa-undo"></i> {{translate('common.annuler')}}
                            </button>
                            <button
                                [disabled]="isloading"
                                (click)="onSubmit()"
                                class="flex items-center gap-1 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                <i
                                    [class]="
                                        isloading
                                            ? 'fas fa-circle-notch fa-spin'
                                            : 'fas fa-save'
                                    "
                                ></i>
                                {{translate('common.enregister')}}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    styleUrl: './save-search.component.scss',
})
export class SaveSearchComponent implements OnInit {
    @Input('search') search;
    constructor(
        public config: ConfigService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<SaveSearchComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private searchService: RestSearchApiService
    ) {
        this.search = this.data.search || {};
    }

    validator = '';

    ngOnInit(): void {
        console.log(this.search);
    }
    isloading = false;
    onSubmit(): void {
        const name = this.search.name?.trim() || '';

        if (name.replace(/\s/g, '').length >= 3) {
            this.isloading = true;
            this.searchService.saveSearch(this.search).subscribe({
                next: () => {
                    this.dialog.open(ResultCourrierComponent, {
                        autoFocus: false,
                        disableClose: true,
                        data: {
                            title: 'Recherche enregistrée avec succès',
                        },
                    });
                    this.dialogRef.close();
                },
                error: () => {
                    this.validator = '* Le Nom doit être unique';
                },
                complete: () => {
                    this.isloading = false;
                },
            });
        } else {
            this.validator = '* La longueur doit être 3 lettres ou plus';
        }
    }
    onCancel(): void {
        if (!this.search.name || this.search.name.trim() === '') {
            this.dialogRef.close();
        } else {
            this.search.name = '';
        }
    }
}
