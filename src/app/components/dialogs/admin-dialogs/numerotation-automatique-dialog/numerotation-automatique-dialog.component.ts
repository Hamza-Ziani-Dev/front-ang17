import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-numerotation-automatique-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './numerotation-automatique-dialog.component.html',
  styleUrl: './numerotation-automatique-dialog.component.scss'
})
export class NumerotationAutomatiqueDialogComponent {
    constructor(public dialogRef: MatDialogRef<NumerotationAutomatiqueDialogComponent>) {}

    items = [
        { name: 'Date' },
        { name: 'Référence automatique' },
        { name: 'Texte personnalisé' }
      ];

      customText: string = 'test1';
      separator: string = 'Aucun';
      previewText: string = '2024#123#test1';

      changePosition(index: number, direction: string) {
        if (direction === 'up' && index > 0) {
          const temp = this.items[index];
          this.items[index] = this.items[index - 1];
          this.items[index - 1] = temp;
        } else if (direction === 'down' && index < this.items.length - 1) {
          const temp = this.items[index];
          this.items[index] = this.items[index + 1];
          this.items[index + 1] = temp;
        }
      }

      save() {
        // Implement save logic here
        console.log('Saved:', this.customText, this.separator);
      }

      closeDialog(){
        this.dialogRef.close(false);
      }
}
