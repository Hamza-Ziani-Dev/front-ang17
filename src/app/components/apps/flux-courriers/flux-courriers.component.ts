import { Component, HostListener, ViewChild,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { MatPaginator } from '@angular/material/paginator';
import { BordereauDialogComponent } from 'app/components/dialogs/bordereau-dialog/bordereau-dialog.component';
import { ListeEmailsSuivisComponent } from 'app/components/dialogs/liste-emails-suivis/liste-emails-suivis.component';
import { DetacherLiaisonComponent } from 'app/components/dialogs/detacher-liaison/detacher-liaison.component';
import { PartagerCourrierComponent } from 'app/components/dialogs/partager-courrier/partager-courrier.component';
import { CourierTrackingComponent } from 'app/components/dialogs/courier-tracking/courier-tracking.component';
import { UpdateCourrierRecentComponent } from 'app/components/dialogs/update-courrier-recent/update-courrier-recent.component';
import { ConfirmationDialogComponent } from 'app/components/dialogs/confirmation-dialog/confirmation-dialog.component';

interface File {
    name: string;
    date: string;

}
export interface resultSearchList {
    id: number;
    ouvrir: string;
    reference: string;
    registrationDate: string;
    receptionDate: string;
    type: string;
    category: string;
    sender: string;
    subject: string;
    owner: string;
    actions: string;
}
@Component({
  selector: 'app-flux-courriers',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './flux-courriers.component.html',
  styleUrl: './flux-courriers.component.scss'
})
export class FluxCourriersComponent implements OnInit{
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    detailsFile :boolean = false;
    isMobileView: boolean = true;
    isTableViewActive = true;
    isMosaicViewActive = false;
    currentPage = 0;
    itemsPerPage = 12;
    totalPages = 0;
    files: File[] = [];
    // isMobile: boolean = false;
    // @HostListener('window:resize', ['$event'])
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    totalRecords = 0;
    showTable: boolean = true;
    dataSource = new MatTableDataSource<resultSearchList>();
    displayedColumns: string[] = [
        'ouvrir',
        'reference',
        'registrationDate',
        'receptionDate',
        'type',
        'category',
        'sender',
        'subject',
        'owner',
        'actions',
    ];
    results: resultSearchList[] = [
        {
            id: 1,
            ouvrir: '',
            reference: 'REF12345',
            registrationDate: '12/12/2012',
            receptionDate: '12/12/2019',
            type: 'Document Type 1',
            category: 'Category A',
            sender: 'Sender 1',
            subject: 'Subject 1',
            owner: 'Owner 1',
            actions: '',
        },
        {
            id: 2,
            ouvrir: '',
            reference: 'REF23456',
            registrationDate: '01/10/2015',
            receptionDate: '02/10/2016',
            type: 'Document Type 2',
            category: 'Category B',
            sender: 'Sender 2',
            subject: 'Subject 2',
            owner: 'Owner 2',
            actions: '',
        },
        {
            id: 3,
            ouvrir: '',
            reference: 'REF34567',
            registrationDate: '03/03/2017',
            receptionDate: '04/03/2018',
            type: 'Document Type 3',
            category: 'Category C',
            sender: 'Sender 3',
            subject: 'Subject 3',
            owner: 'Owner 3',
            actions: '',
        },
        {
            id: 4,
            ouvrir: '',
            reference: 'REF45678',
            registrationDate: '04/05/2018',
            receptionDate: '05/05/2019',
            type: 'Document Type 4',
            category: 'Category D',
            sender: 'Sender 4',
            subject: 'Subject 4',
            owner: 'Owner 4',
            actions: '',
        },
        {
            id: 5,
            ouvrir: '',
            reference: 'REF45678',
            registrationDate: '04/05/2018',
            receptionDate: '05/05/2019',
            type: 'Document Type 4',
            category: 'Category D',
            sender: 'Sender 4',
            subject: 'Subject 4',
            owner: 'Owner 4',
            actions: '',
        },
        {
            id: 6,
            ouvrir: '',
            reference: 'REF45678',
            registrationDate: '04/05/2018',
            receptionDate: '05/05/2019',
            type: 'Document Type 4',
            category: 'Category D',
            sender: 'Sender 4',
            subject: 'Subject 4',
            owner: 'Owner 4',
            actions: '',
        },
        {
            id: 7,
            ouvrir: '',
            reference: 'REF45678',
            registrationDate: '04/05/2018',
            receptionDate: '05/05/2019',
            type: 'Document Type 4',
            category: 'Category D',
            sender: 'Sender 4',
            subject: 'Subject 4',
            owner: 'Owner 4',
            actions: '',
        },
    ];



    constructor(
        private dialog: MatDialog,
        private translocoService: TranslocoService,
    ) {}

    ngOnInit() {
        this.dataSource.data = this.results;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.checkResponsiveView();

        // Initialize with some dummy data
        this.files = Array(10).fill(0).map((_, i) => ({
            name: `File ${i + 1}`,
            date: `2024-05-${(i + 1).toString().padStart(2, '0')}`
        }));
        this.totalPages = Math.ceil(this.files.length / this.itemsPerPage);
    }

    ngAfterViewInit() {
        // Set up sorting and pagination
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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

     // Open Dialog Update
     openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateCourrierRecentComponent, {

        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    // Dilaog Processus Courrier
    openProcessusDialog(): void {
        const dialogRef = this.dialog.open(CourierTrackingComponent, {
            width: '70%',
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }


    // Dialog Partager Courrier
    openPartagerDialog(): void {
        const dialogRef = this.dialog.open(PartagerCourrierComponent, {
          width: '400px', // Adjust width as needed
          data: { /* you can pass data here if needed */ }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog closed, result:', result);
        });
      }

    //  Open Dialog Detacher Liaison
    openDetacherLiaisonDialog(): void {
        const dialogRef = this.dialog.open(DetacherLiaisonComponent, {
          data: { /* pass any data if necessary */ }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Detacher Liaison dialog closed, result:', result);
        });
      }


    //   Open Dialog Bordereau
      openBordereauDialog(): void {
        this.dialog.open(BordereauDialogComponent, {
        //   width: '100%', // Adjust width as necessary
        });
      }

    // Open Dialog Email Suivis :
    openEmailSuivisDialog(): void {
        this.dialog.open(ListeEmailsSuivisComponent, {
          width: '400px',  // Adjust width as necessary
        });
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






 // Method to open the drawer
 openDetailsDrawer(id: number) {
    this.matDrawer.toggle();
}
// Method to close the drawer
closeDrawer() {
    this.matDrawer.close();
}
}
