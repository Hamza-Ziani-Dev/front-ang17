import { Component, HostListener, ViewChild ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ConfirmationDialogComponent } from 'app/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-documents-partages',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule],
  templateUrl: './documents-partages.component.html',
  styleUrl: './documents-partages.component.scss'
})
export class DocumentsPartagesComponent implements OnInit{
    isMobileView: boolean = true;
    isTableViewActive = false;
    isMosaicViewActive = true;
    currentPage = 0;
    itemsPerPage = 12;
    totalPages = 0;
    files: File[] = [];
    showTable: boolean = true;
    @ViewChild('matDrawer') matDrawer!: MatDrawer;

    constructor(
        private dialog: MatDialog,
        private translocoService: TranslocoService,
    ){}

    ngOnInit(): void {
        this.checkResponsiveView();


    }

      // Method to detect mobile view
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkResponsiveView();
  }

  // Method to check screen size and set isMobileView
  checkResponsiveView(): void {
    this.isMobileView = window.innerWidth < 640;
    if (this.isMobileView) {
      this.showTable = false; // On mobile, show mosaic by default
    }
  }

  // Toggle to show mosaic view
  showMosaicView(): void {
    this.showTable = false;
    this.isTableViewActive = false;
    this.isMosaicViewActive = true;
  }

  // Toggle to show table view (only if not mobile)
  showTableView(): void {
    if (!this.isMobileView) {
      this.showTable = true;
    }
    this.isTableViewActive = true;
      this.isMosaicViewActive = false;
  }

  //   Pagination:
get paginatedFiles(): File[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.files.slice(start, start + this.itemsPerPage);
}

previousPage() {
    if (this.currentPage > 0) {
        this.currentPage--;
    }
}

nextPage() {
    if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
    }
}

goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
    }
}

getPaginationArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index);
}
// End Pagination


  // Dialog Supprimer
  openSupprimerDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            // Execute delete logic here
            console.log('Item deleted');
        } else {
            console.log('Deletion canceled');
        }
    });
}

OpenViewDoc(){
    // const dialogRef = this.dialog.open(AjouterDocumentDialogComponent, {
    //     //   width: '100%',
    //       data: { url: 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf' }, // Replace with dynamic URL if needed
    //     });

    //     dialogRef.afterClosed().subscribe((result) => {
    //       console.log('Dialog closed');
    //     });
}
}
