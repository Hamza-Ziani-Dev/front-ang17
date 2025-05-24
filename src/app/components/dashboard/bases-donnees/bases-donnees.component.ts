import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bases-donnees',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './bases-donnees.component.html',
  styleUrl: './bases-donnees.component.scss'
})
export class BasesDonneesComponent {
    isChecked : boolean = false;
    toggleSwitch() {
        this.isChecked = !this.isChecked;
      }

      constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }

    isMySQLChecked: boolean = true;
  isOracleChecked: boolean = false;
  isMSSQLChecked: boolean = false;

  toggleMySQL() {
    this.isMySQLChecked = !this.isMySQLChecked;
  }

  toggleOracle() {
    this.isOracleChecked = !this.isOracleChecked;
  }

  toggleMSSQL() {
    this.isMSSQLChecked = !this.isMSSQLChecked;
  }

  onMySQLChange(event: any) {
    // Handle MySQL toggle change
  }

  onOracleChange(event: any) {
    // Handle Oracle toggle change
  }

  onMSSQLChange(event: any) {
    // Handle MSSQL toggle change
  }
}
