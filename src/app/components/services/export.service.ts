import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

//import jspdf from 'jspdf'
import 'jspdf-autotable'
import { title } from 'process';

declare let jspdf;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const PDF_TYPE = 'application/pdf';
const PDF_EXTENSION = '.pdf';

@Injectable({
    providedIn: 'root'
  })
export class ExportService {



  public exportAsExcelFile(json: any, excelFileName: string): void {
 console.log(json);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
                                              ;

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //workbook.

    //const cell = workbook.Cell
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  //  saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  // }
  saveAsExcelFile(data: any, fileName: string,ext=EXCEL_EXTENSION): void {
    console.log(data,fileName,ext);

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + ext);
  }




  async exportAsPDF(jsonData, fileName, type ) {



    const head = [Object.keys(jsonData[0])]


    const data = await this.jsonToArrays(jsonData)
    // //console.log(Object.keys(jsonData[0]))
    //console.log(data)


    const doc = new jspdf('p', 'pt', 'a4');
    doc.text("Rapport des courriers", 120, 40);
    doc.setFontSize(10);
    doc.text("Type : " + type , 120, 52);
    //   if (base64Img) {
    doc.addImage(localStorage.getItem("lg"), 'PNG', 60, 10, 50, 50);
    // }
    // doc.text("Report", data.settings.margin.left + 15, 22);

    // const title = new Fon
    doc.autoTable({
      // ...document
      theme: 'grid',
      margin: 60,
      head: head,
      body: data
    });
    doc.save(fileName + '_export_' + new Date().getTime() + '.' + PDF_EXTENSION)
    //

  }

  async jsonToArrays( json : Object[]) {
    let dataArrays = new Array<Array<string | number>>();



    json.forEach(obj => {
      const row = new Array<any>();
      Object.values(obj).forEach(val  => {
        row.push(val)
      });
       dataArrays.push(row)
    });

     return dataArrays;



  }
  // exportAsPDF(data , fileName) {
  //   let exportAsConfig: ExportAsConfig = {
  //     type: 'pdf', // the type you want to download
  //     elementIdOrContent: this.generateContent(data),
  //     options : { // html-docx-js document options

  //       margins: {
  //         top: '20',
  //         right : '20',
  //         left : '20'
  //       }
  //     } // the id of html/table element

  //   }
  //   this.exportAsService.save(exportAsConfig, fileName + '_export_' + new Date().getTime() ).subscribe(() => {
  //     // save started
  //   })

  // }

generateContent(data): string {
  let table = `
<table >

      <tr>
    <th> Id	</th>
    <th>Réference	</th>
    <th> Traitment	</th>
    <th> Objet	</th>
    <th> Type	</th>

    <th> Émetteur	</th>
    <th> Destinataire	</th>

    <th> Nature	</th>
      </tr>


`;

  for (let item of data) {

    table += `
<tr >
<td>${item.Id}</td>
<td>${item.Réference}</td>
<td>${item.Traitment}</td>
<td>${item.Objet}	</td>
<td>${item.Type}</td>
<td>${item.Émetteur}</td>
<td>${item.Destinataire}</td>
<td>${item.Nature}	</td>
</tr>

`
  }
  table += "</table>"
  //console.log(table)
  return `<div style="margin-right:3px;margin-left:3px">${table}</div>` ;
}

}
