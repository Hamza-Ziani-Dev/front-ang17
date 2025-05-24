import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorBindingService {



  pageContents = [{
    objectFormat: {
      ops: [
        { insert: ' ' }
      ]
    },
    output: ""

  }]

  isEmpty = []
  removePage(currentPage: number) {
    const t = this.pageContents.splice(currentPage - 1, 1)

  }

  createNewPage() {
    this.pageContents.push({
      objectFormat: {

        ops: [
          { insert: ' ' }
        ]
      },
      output: ""

    });


    this.currentPage = this.pageContents.length - 1;

    this.totalPages = this.pageContents.length;

  }
  currentPage = 0;
  totalPages = 0;
  constructor() { }

  init() {
    this.pageContents = [...[{
      objectFormat: {

        ops: [
          { insert: ' ' }
        ]
      },
      output: ""

    }]]

  }
}
