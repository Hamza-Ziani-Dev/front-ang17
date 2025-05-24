import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { TranslocoService ,TranslocoModule} from '@ngneat/transloco';
@Component({
  selector: 'app-ajouter-single-courrier',
  standalone: true,
  imports: [CommonModule,PdfViewerModule,TranslocoModule,MaterialModuleModule,FormsModule],
  templateUrl: './ajouter-single-courrier.component.html',
  styleUrl: './ajouter-single-courrier.component.scss'
})
export class AjouterSingleCourrierComponent implements OnInit {
    showDocument : boolean = true;
    selectedDocumentType: string = '';
    showFields: boolean = false;
    pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";


    onDocumentTypeChange() {
        this.showFields = !!this.selectedDocumentType; // Show fields if a type is selected
      }

     /**
   * Constructor
   */

    constructor(
        private fb: FormBuilder,
        private _translocoService : TranslocoService
    ) {


    }

    ngOnInit(): void {

    }

    onClose(){

    }




    closeModal(): void {

    }

    onSubmit(): void {

    }
}
