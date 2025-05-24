import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
export interface Journals {
    id: number;
    date: string;
    utilisateur: string;
    nomSecondaire: string;
    typeEvenement: string;
    details: string;
    composante: string;
}
@Component({
  selector: 'app-recharche-journal-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './recharche-journal-dialog.component.html',
  styleUrl: './recharche-journal-dialog.component.scss'
})
export class RecharcheJournalDialogComponent {
    currentPage = 0;
    itemsPerPage = 12;
    totalPages = 0;
    journalsData: Journals[] = [
        {
            id: 1,
            date: "2024-10-01",
            utilisateur: "Alice Dupont",
            nomSecondaire: "Système",
            typeEvenement: "Connexion",
            details: "Connexion réussie à l'application",
            composante: "Sécurité"
        },
        {
            id: 2,
            date: "2024-10-02",
            utilisateur: "Bob Martin",
            nomSecondaire: "Réseau",
            typeEvenement: "Modification",
            details: "Changement de configuration réseau",
            composante: "Infrastructure"
        },
        {
            id: 3,
            date: "2024-10-03",
            utilisateur: "Claire Laurent",
            nomSecondaire: "Base de données",
            typeEvenement: "Erreur",
            details: "Erreur lors de l'insertion de données",
            composante: "Base de données"
        },
        {
            id: 4,
            date: "2024-10-04",
            utilisateur: "David Johnson",
            nomSecondaire: "Serveur",
            typeEvenement: "Alerte",
            details: "Température élevée détectée",
            composante: "Matériel"
        },
        {
            id: 5,
            date: "2024-10-05",
            utilisateur: "Emma Wilson",
            nomSecondaire: "Application",
            typeEvenement: "Mise à jour",
            details: "Mise à jour de version appliquée",
            composante: "Logiciel"
        },
        {
            id: 6,
            date: "2024-10-06",
            utilisateur: "Frank Harris",
            nomSecondaire: "Sécurité",
            typeEvenement: "Accès refusé",
            details: "Tentative d'accès non autorisée",
            composante: "Sécurité"
        },
        {
            id: 7,
            date: "2024-10-07",
            utilisateur: "Grace Lee",
            nomSecondaire: "Interface utilisateur",
            typeEvenement: "Modification",
            details: "Modification des paramètres de l'utilisateur",
            composante: "UI"
        },
        {
            id: 8,
            date: "2024-10-08",
            utilisateur: "Henry Miles",
            nomSecondaire: "Base de données",
            typeEvenement: "Suppression",
            details: "Suppression de plusieurs enregistrements",
            composante: "Base de données"
        },
        {
            id: 9,
            date: "2024-10-09",
            utilisateur: "Isabelle Moore",
            nomSecondaire: "Système",
            typeEvenement: "Démarrage",
            details: "Démarrage du système",
            composante: "OS"
        },
        {
            id: 10,
            date: "2024-10-10",
            utilisateur: "Jack Brown",
            nomSecondaire: "Application",
            typeEvenement: "Erreur",
            details: "Erreur de chargement de l'application",
            composante: "Logiciel"
        }
    ];

    constructor(
        private dialog: MatDialog,
        private translocoService: TranslocoService,
    ){}



}
