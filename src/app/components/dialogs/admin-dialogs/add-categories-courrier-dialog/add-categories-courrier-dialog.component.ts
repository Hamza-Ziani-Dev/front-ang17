import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-categories-courrier-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './add-categories-courrier-dialog.component.html',
  styleUrl: './add-categories-courrier-dialog.component.scss'
})
export class AddCategoriesCourrierDialogComponent {
    items: string[] = ["Courrier arrivé", "Courrier Depart"];
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
}
