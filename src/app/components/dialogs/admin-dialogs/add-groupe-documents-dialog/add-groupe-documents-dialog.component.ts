import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-groupe-documents-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './add-groupe-documents-dialog.component.html',
  styleUrl: './add-groupe-documents-dialog.component.scss'
})
export class AddGroupeDocumentsDialogComponent {
    // List of all available items
  items: string[] = [
    "all Droit", "add-per", "type-3", "type-4", "type-5", "type-6", "type-7", "type-8"
  ];

  // List of selected items
  selectedItems: string[] = [];

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
    this.paginatedItems = this.items.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  totalPages(): number {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  // Add item to selected items list
  addSelectedItem(event: any): void {
    const selectedItem = event.target.value;
    if (!this.selectedItems.includes(selectedItem)) {
      this.selectedItems.push(selectedItem);
    }
  }

  // Remove item from selected items list
  removeSelectedItem(item: string): void {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
  }
}
