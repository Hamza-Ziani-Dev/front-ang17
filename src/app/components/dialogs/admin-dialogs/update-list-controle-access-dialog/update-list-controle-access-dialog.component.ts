import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-list-controle-access-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-list-controle-access-dialog.component.html',
  styleUrl: './update-list-controle-access-dialog.component.scss'
})
export class UpdateListControleAccessDialogComponent {
    utilisateurs: string[] = ["Jean Dupont", "Sophie Martin", "Ali Ben Amar", "Mariam Khadra", "Hassan Mouhajir"];
    documents: string[] = ["test1", "test", "all-per"];
    courriers: string[] = ["test1", "test", "all-per"];

    selectedUtilisateurs: string[] = [];
selectedDocuments: string[] = [];
selectedCourriers: string[] = [];

addSelectedItem(event: any, category: string): void {
  const item = event.target.value;
  if (!item) return;

  if (category === 'utilisateurs' && !this.selectedUtilisateurs.includes(item)) {
    this.selectedUtilisateurs.push(item);
  } else if (category === 'documents' && !this.selectedDocuments.includes(item)) {
    this.selectedDocuments.push(item);
  } else if (category === 'courriers' && !this.selectedCourriers.includes(item)) {
    this.selectedCourriers.push(item);
  }

  event.target.value = '';
}

removeSelectedItem(item: string, category: string): void {
  if (category === 'utilisateurs') {
    this.selectedUtilisateurs = this.selectedUtilisateurs.filter(i => i !== item);
  } else if (category === 'documents') {
    this.selectedDocuments = this.selectedDocuments.filter(i => i !== item);
  } else if (category === 'courriers') {
    this.selectedCourriers = this.selectedCourriers.filter(i => i !== item);
  }
}

clearSelection(type: string): void {
    switch (type) {
      case 'utilisateurs':
        this.selectedUtilisateurs = [];
        break;
      case 'documents':
        this.selectedDocuments = [];
        break;
      case 'courriers':
        this.selectedCourriers = [];
        break;
    }
  }
}
