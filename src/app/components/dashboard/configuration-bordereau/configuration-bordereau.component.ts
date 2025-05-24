import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-configuration-bordereau',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,ReactiveFormsModule,TranslocoModule],
  templateUrl: './configuration-bordereau.component.html',
  styleUrl: './configuration-bordereau.component.scss'
})
export class ConfigurationBordereauComponent {
    availableItems: string[] = ['Reference'];
    selectedItems: string[] = [
      'Nature',
      'Date d\'enregistrement',
      'Objet',
      'Emetteur/Destinataire(s)',
      'Type courrier'
    ];

    constructor(  private translocoService: TranslocoService){}

    selectedAvailableItems: string[] = [];
    selectedSelectedItems: string[] = [];
    borderauTitle: string = '';

    selectAvailableItem(item: string) {
      const index = this.selectedAvailableItems.indexOf(item);
      if (index === -1) {
        this.selectedAvailableItems.push(item);
      } else {
        this.selectedAvailableItems.splice(index, 1);
      }
    }

    selectSelectedItem(item: string) {
      const index = this.selectedSelectedItems.indexOf(item);
      if (index === -1) {
        this.selectedSelectedItems.push(item);
      } else {
        this.selectedSelectedItems.splice(index, 1);
      }
    }

    isAvailableItemSelected(item: string): boolean {
      return this.selectedAvailableItems.includes(item);
    }

    isSelectedItemSelected(item: string): boolean {
      return this.selectedSelectedItems.includes(item);
    }

    moveToSelected() {
      this.selectedItems.push(...this.selectedAvailableItems);
      this.availableItems = this.availableItems.filter(item => !this.selectedAvailableItems.includes(item));
      this.selectedAvailableItems = [];
    }

    moveToAvailable() {
      this.availableItems.push(...this.selectedSelectedItems);
      this.selectedItems = this.selectedItems.filter(item => !this.selectedSelectedItems.includes(item));
      this.selectedSelectedItems = [];
    }

    moveAllToSelected() {
      this.selectedItems.push(...this.availableItems);
      this.availableItems = [];
      this.selectedAvailableItems = [];
    }

    moveAllToAvailable() {
      this.availableItems.push(...this.selectedItems);
      this.selectedItems = [];
      this.selectedSelectedItems = [];
    }

    moveUp(array: string[], item: string) {
      const index = array.indexOf(item);
      if (index > 0) {
        [array[index], array[index - 1]] = [array[index - 1], array[index]];
      }
    }

    moveDown(array: string[], item: string) {
      const index = array.indexOf(item);
      if (index < array.length - 1) {
        [array[index], array[index + 1]] = [array[index + 1], array[index]];
      }
    }
}
