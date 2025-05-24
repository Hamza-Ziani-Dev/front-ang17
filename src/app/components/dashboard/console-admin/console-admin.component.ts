import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesCourriersComponent } from '../categories-courriers/categories-courriers.component';
import { OrganismeComponent } from '../organisme/organisme.component';
import { OrganigrammeComponent } from '../organigramme/organigramme.component';
import { UtilisateursComponent } from '../utilisateurs/utilisateurs.component';
import { TypesCourriersComponent } from '../types-courriers/types-courriers.component';
import { TypesDocumentsComponent } from '../types-documents/types-documents.component';
import { GroupsDocumentsComponent } from '../groups-documents/groups-documents.component';
import { AttributsComponent } from '../attributs/attributs.component';
import { ProcessusComponent } from '../processus/processus.component';
import { ProfileAbsenceComponent } from '../profile-absence/profile-absence.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { RegistreElectroniqueComponent } from '../registre-electronique/registre-electronique.component';
import { DestinatairesComponent } from '../destinataires/destinataires.component';
import { EmetteursComponent } from '../emetteurs/emetteurs.component';
import { LdapComponent } from '../ldap/ldap.component';
import { SecuriteComponent } from '../securite/securite.component';
import { VolumesStockageComponent } from '../volumes-stockage/volumes-stockage.component';
import { UtilisateursConnectesComponent } from '../utilisateurs-connectes/utilisateurs-connectes.component';
import { BasesDonneesComponent } from '../bases-donnees/bases-donnees.component';
import { ConfigurationRapportComponent } from '../configuration-rapport/configuration-rapport.component';
import { ComptesDesactivesComponent } from "../comptes-desactives/comptes-desactives.component";
import { EnTeteComponent } from '../en-tete/en-tete.component';
import { FluxElectroniqueComponent } from '../flux-electronique/flux-electronique.component';
import { GroupeUtilisateursComponent } from '../groupe-utilisateurs/groupe-utilisateurs.component';
import { IntegrationConfigurationComponent } from '../integration-configuration/integration-configuration.component';
import { JournalisationComponent } from '../journalisation/journalisation.component';
import { QualitesComponent } from '../qualites/qualites.component';
import { ConfigurationDocumaniaCaptureComponent } from '../configuration-documania-capture/configuration-documania-capture.component';
import { ChainesConnexionComponent } from '../chaines-connexion/chaines-connexion.component';
import { ArchivePhysiqueComponent } from '../archive-physique/archive-physique.component';
import { ConfigurationBordereauComponent } from '../configuration-bordereau/configuration-bordereau.component';

@Component({
    selector: 'app-console-admin',
    standalone: true,
    imports: [
    CommonModule,
    MaterialModuleModule,
    HttpClientModule,
    AngularEditorModule,
    TranslocoModule,
    OrganismeComponent,
    OrganigrammeComponent,
    UtilisateursComponent,
    TypesCourriersComponent,
    TypesDocumentsComponent,
    CategoriesCourriersComponent,
    GroupsDocumentsComponent,
    AttributsComponent,
    ProcessusComponent,
    ProfileAbsenceComponent,
    NotificationsComponent,
    RegistreElectroniqueComponent,
    DestinatairesComponent,
    EmetteursComponent,
    LdapComponent,
    SecuriteComponent,
    VolumesStockageComponent,
    UtilisateursConnectesComponent,
    BasesDonneesComponent,
    ConfigurationRapportComponent,
    ComptesDesactivesComponent,
    EnTeteComponent,
    FluxElectroniqueComponent,
    GroupeUtilisateursComponent,
    IntegrationConfigurationComponent,
    JournalisationComponent,
    QualitesComponent,
    ConfigurationDocumaniaCaptureComponent,
    ChainesConnexionComponent,
    ArchivePhysiqueComponent,
    ConfigurationBordereauComponent
],

    templateUrl: './console-admin.component.html',
    styleUrl: './console-admin.component.scss',
})
export class ConsoleAdminComponent {
    showMenu: boolean = false;
    isChecked: boolean = false;
    allCourriers: boolean = true; // default to showing courriers
    allDocuments: boolean = false;
    isMobile: boolean = false; // Flag to check if the view is mobile
    activeTab: string = 'organisme'; // Default active tab
    isDropdownOpen: boolean = false; // Track dropdown state
    selectedContent: string = 'privilage'; // Track selected content
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
        this.checkIfMobile(window.innerWidth);
    }
    // Method to change the active tab
    selectTab(tab: string) {
        this.activeTab = tab;
        this.isDropdownOpen = false; // Close dropdown when changing tabs
    }

    // Toggle dropdown visibility
    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    // Handle Plus click
    openListesControlesAcces() {
        console.log('Listes Controles Acces');
        this.selectedContent = 'listAccess'; // Change content
        this.isDropdownOpen = false; // Close dropdown after selection
    }

    // Handle Moins click to display privilege content
    openPrivilege() {
        console.log('Privilège');
        this.selectedContent = 'privilage'; // Change content
        this.isDropdownOpen = false; // Close dropdown after selection
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkIfMobile(event.target.innerWidth);
    }

    checkIfMobile(width: number) {
        this.isMobile = width < 768; // Adjust the breakpoint as needed
    }

    // Method to toggle menu visibility
    toggleMenu() {
        this.showMenu = !this.showMenu;
    }

    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }

    @ViewChild('fileInput') fileInput: ElementRef | undefined;

    imagePreview: string | ArrayBuffer | null = null;

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    triggerFileInput(): void {
        if (this.fileInput) {
            this.fileInput.nativeElement.click();
        }
    }

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' },
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText',
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        uploadUrl: 'v1/image',
        // upload: (file: File) => { ... }
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
    };
}
