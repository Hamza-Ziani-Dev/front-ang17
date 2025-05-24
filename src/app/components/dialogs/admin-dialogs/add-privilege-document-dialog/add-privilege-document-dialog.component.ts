import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-privilege-document-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './add-privilege-document-dialog.component.html',
  styleUrl: './add-privilege-document-dialog.component.scss'
})
export class AddPrivilegeDocumentDialogComponent {
   // List of all Permissions:
  permissions: string[] = ["all Droit", "add-per", "ajouter", "supprimer", "update"];

  // List type document:
  documents: string[] = ["test1", "test2", "test3"];

  // List of selected items
  selectedPermissions: string[] = [];
  selectedDocuments: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 4;
  paginatedItems: string[] = [];

  ngOnInit(): void {
    this.updatePagination();
  }

  // Update pagination for the displayed items
  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    this.paginatedItems = this.permissions.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  totalPages(): number {
    return Math.ceil(this.permissions.length / this.itemsPerPage);
  }

  // Add item to selected permissions list
  addSelectedPermission(event: any): void {
    const selectedItem = event.target.value;
    if (selectedItem && !this.selectedPermissions.includes(selectedItem)) {
      this.selectedPermissions.push(selectedItem);
    }
  }

  // Remove item from selected permissions list
  removeSelectedPermission(item: string): void {
    this.selectedPermissions = this.selectedPermissions.filter(i => i !== item);
  }

  // Add item to selected documents list
  addSelectedDocument(event: any): void {
    const selectedItem = event.target.value;
    if (selectedItem && !this.selectedDocuments.includes(selectedItem)) {
      this.selectedDocuments.push(selectedItem);
    }
  }

  // Remove item from selected documents list
  removeSelectedDocument(item: string): void {
    this.selectedDocuments = this.selectedDocuments.filter(i => i !== item);
  }
}
