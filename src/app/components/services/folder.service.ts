import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';
import { User } from '../models/User';
import { Folder } from '../models/folder.model';
import { Page } from '../models/page';
import { FavoriteFolder } from '../models/favorite-folder';

@Injectable({
    providedIn: 'root',
})
export class FolderService {
    apiUrl = environment.apiUrl; // Base URL for API requests
    user: User; // Current user object
    header: HttpHeaders; // HTTP headers for requests

    constructor(
        private http: HttpClient,
        private serviceRestApi: RestApiService
    ) {
        this.user = new User(); // Initialize a new User object
        // Retrieve user data from session storage and update the user object
        this.user = serviceRestApi.tst(
            this.user,
            JSON.parse(sessionStorage.getItem('uslog'))
        );
        // Set default headers for API requests
        this.header = new HttpHeaders({
            'content-Type': 'application/json',
        });
    }

    // Fetch steps to do with pagination, sorting, and filtering options
    public getStepsToDo(
        pageNumber: number, // Current page number
        pageSize: number, // Number of items per page
        type, // Type of steps to filter
        sort, // Sort field
        order, // Sort order (ascending/descending)
        myOnly // Flag to filter only user's steps
    ) {
        const tri = sort ? sort + ',' + (order ? 'asc' : 'desc') : ''; // Construct sorting string
        return this.http.get(
            this.apiUrl +
                '/api/steps/todo/' +
                tri +
                '?type=' +
                (type ? type : -1) + // Default to -1 if type is not provided
                '&filter=-1' + // Default filter value
                '&myOnly=' +
                myOnly + // Include user-specific filter
                '&page=' +
                pageNumber + // Current page number
                '&size=' +
                pageSize, // Number of items per page
            { headers: this.header }
        );
    }

    // Fetch all folders with pagination
    public getAllFolders(pageNumber: number, pageSize: number) {
        return this.http.get<Page<Folder>>(
            `http://localhost:8089/api/v1/folder/last-week?page=${pageNumber}&size=${pageSize}`, // API endpoint for folders
            { headers: this.header } // Include headers
        );
    }

    // Fetch Current Step By Folder :
    findCurrentStepByFolder(id) {
        return this.http.get(`${environment.apiUrl}/step/folder/${id}`, {
            headers: this.header,
        });
    }

    // Get Favorit Folders Ids :
    public getFAvoritFoldersIds() {
        return this.http.get<string[]>(
            `${environment.apiUrl}/favorite-folder/user`,
            { headers: this.header }
        );
    }

    // Get Folder Type :
    getFolderType(id) {
        return this.http.get(environment.apiUrl + '/folder/gettype/' + id, {
            headers: this.header,
        });
    }

    // Get All Folders :
    public getAll(pageNumber: number, pageSize: number){
        return this.http.get(`${environment.apiUrl}/folder/all?page=${pageNumber}&size=${pageSize}`,{headers:this.header})
      }

    //   Get All Folders Month :
      public getAllFoldersMonth(pageNumber: number, pageSize: number){
        return this.http.get<Page<Folder>>(`${environment.apiUrl}/folder/last-month?page=${pageNumber}&size=${pageSize}`,{headers:this.header})
                .pipe();
      }

    //   Get All Folders OLD :
      public getAllFoldersOLD(pageNumber: number, pageSize: number){
        return this.http.get<Page<Folder>>(`${environment.apiUrl}/folder/OLD?page=${pageNumber}&size=${pageSize}`,{headers:this.header})
                .pipe();
      }
    //   Add To Favorite :
      public addToFavorite(folderId: number){
        return this.http.put(`${environment.apiUrl}/favorite-folder/${folderId}`,{},{headers:this.header})

      }
    //   Get Favorite Folder :
      public getfavoritefolder( page ){
        return this.http.get<FavoriteFolder[]>(`${environment.apiUrl}/favorite-folder/Find?page=${page}&size=12` ,{headers:this.header});
      }
    //   Count Folder Reccent :
    public CountFolderrecent(  ){
        return this.http.get<number>(`${environment.apiUrl}/folder/count` ,{headers:this.header});
      }
    //  Delete Favorite Folder :
    public deletefavoritefolder(folderId){
        return this.http.delete(`${environment.apiUrl}/favorite-folder/${folderId}`,{headers:this.header});
      }
}
