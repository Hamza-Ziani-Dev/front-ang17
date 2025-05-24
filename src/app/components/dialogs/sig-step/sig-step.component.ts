import {
    Component,
    AfterViewInit,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    EventEmitter,
    Output,
    Inject,
    CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { SignService } from 'app/components/services/sign.service';
import { ConfigService } from 'app/components/services/config.service';
import { LoadingComponent } from '../loading/loading.component';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { SignrequestComponent } from './signrequest/signrequest.component';
import { OperationResultDialogComponent } from '../operation-result-dialog/operation-result-dialog.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ResultComponent } from '../result/result.component';
@Component({
    selector: 'app-sig-step',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule, PdfViewerModule],
    templateUrl: './sig-step.component.html',
    styleUrl: './sig-step.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SigStepComponent implements OnInit, AfterViewInit {
    @Input() title;
    @ViewChild('signature') signature: ElementRef;
    @ViewChild('pdfViewer', { static: false }) child: ElementRef;

    pdfViewer: ElementRef;
    signGraphic;
    signFile: any;
    showSign: boolean = false;
    page = 1;
    signatureHide = true;
    docSize = { h: 0, w: 0 };
    @Input() documentId;
    @Input() pdfSrc;
    @Input() folderRef;
    isLoaded = false;
    inBounds = true;
    edge = {
        top: true,
        bottom: true,
        left: true,
        right: true,
    };

    position = { x: 0, y: 10 };

    signCoordinates = {
        x: 0,
        y: 0,
    };
    totalPages: number = 1;
    @Output() back = new EventEmitter<any>();
    pages: number[];
    compSigImage: unknown;
    constructor(
        public config: ConfigService,
        public sign: SignService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<SigStepComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.title = data.title;
        (this.folderRef = data.folderRef),
            (this.pdfSrc = this.data.pdfSrc),
            (this.documentId = this.data.documentId);
    }
    ngAfterViewInit(): void {
        this.pdfViewer = this.child?.nativeElement;
    }

    ngOnInit(): void {}

   onSubmit() {
  const loadingRef = this.dialog.open(LoadingComponent, {
    disableClose: true,
    panelClass: 'loading-dialog',
    data: {
      title: this.config.c.sigStep.sigloading.title,
      text: this.config.c.sigStep.sigloading.text,
    },
  });

  const h = this.signature.nativeElement.height;
  const w = this.signature.nativeElement.width;
  const draggerHolder = document.getElementById('dragger');

  this.compressImage(
    this.signGraphic,
    draggerHolder.clientWidth,
    draggerHolder.clientHeight
  ).then((res) => {
    this.sign
      .signDocument(
        this.documentId,
        res,
        this.signCoordinates.x,
        this.signCoordinates.y,
        this.page,
        this.docSize.h,
        this.docSize.w
      )
      .subscribe(
        (response) => {
          const successRef = this.dialog.open(OperationResultDialogComponent, {
            disableClose: true,
            data: {
              operation: "sigsuccess",
            },
            panelClass: 'success-dialog',
          });

          successRef.afterClosed().subscribe(() => {
            loadingRef.close();
            this.back.emit('ok');
            this.dialogRef.close();
          });
        },
        (error) => {
          // Open error dialog
          loadingRef.close();

          const errorRef = this.dialog.open(ResultComponent, {
            disableClose: true,
            data: {
              title: "sigfailed",
              etat: -1,
            },
            panelClass: 'error-dialog',
          });

          errorRef.afterClosed().subscribe(() => {
          });
        }
      );
  });
}


    onCancel() {
        this.dialogRef.close();
    }
    onSignatureChange(e) {
        if (e.target.files) {
            const file = e.target.files[0];
            this.signFile = file;
            let reader = new FileReader();
            reader.onload = () => {
                this.signGraphic = reader.result as string;
                this.position.x = this.pdfViewer['offsetLeft'];
                this.position.y = 10;
                this.showSign = true;
            };
            reader.readAsDataURL(file);
        }
    }

    onDragBegin(e) {}
    stopped(e) {}

    pdfboundesChecker(b) {
        const a = { ...b };
        a.style.width = '80%';
        console.log(a);
        return a;
    }
    checkEdge(event) {
        this.edge = event;
    }
    onMoving(e, d) {
        if (
            this.edge.bottom &&
            this.edge.left &&
            this.edge.right &&
            this.edge.top
        ) {
            this.signCoordinates.x = e.x - this.position.x;
            this.signCoordinates.y = e.y - this.position.y;
            d.style.cursor = 'move';
        } else d.style.cursor = 'not-allowed';
    }

    onMoveEnd(e) {}
    simpleSign() {
        const loadingRef = this.dialog.open(LoadingComponent, {
            disableClose: true,
            panelClass: 'loading-dialog',
            data: {
                title: 'Document en train de signer',
                text: "C'est bientôt, merci de patienter",
            },
        });

        const draggerHolder = document.getElementById('dragger');

        this.compressImage(
            this.signGraphic,
            draggerHolder.clientWidth,
            draggerHolder.clientHeight
        ).then((res) => {
            this.compSigImage = res;

            // Show the sign request dialog
            const signReqRef = this.dialog.open(SignrequestComponent, {
                disableClose: true,
                panelClass: 'sign-request-dialog',
                data: {
                    title: 'Envoi en cours',
                    message: "En cours d'envoyer votre code E-Sign",
                    loading: true,
                },
            });

            this.sign
                .SignRequest(
                    this.documentId,
                    this.signCoordinates.x,
                    this.signCoordinates.y,
                    this.page,
                    this.docSize.h,
                    this.docSize.w
                )
                .subscribe((res) => {
                    signReqRef.componentInstance.loading = false;

                    Object.assign(signReqRef.componentInstance, {
                        sigReqeustId: res.sigReqeustId,
                        singerEmail: res.singerEmail,
                        documentId: res.documentId,
                        validationTime: res.validationTime,
                        title: this.config.c.signreq.codeEsign,
                        message:
                            this.config.c.signreq.codeSent + res.singerEmail,
                    });

                    // Subscribe to the passCode EventEmitter
                    signReqRef.componentInstance.passCode.subscribe((resp) => {
                        if (resp == null) {
                            this.back.emit('ok');
                            this.dialogRef.close();
                            signReqRef.close();
                            loadingRef.close();
                            return;
                        }

                        signReqRef.componentInstance.verificationErr = null;

                        this.sign
                            .signVerify(
                                resp.reqId,
                                resp.code,
                                this.compSigImage
                            )
                            .subscribe(
                                (sigRes) => {
                                    signReqRef.close();

                                    // Final success modal
                                    const resultRef = this.dialog.open(
                                        OperationResultDialogComponent,
                                        {
                                            disableClose: true,
                                            panelClass: 'success-dialog',
                                            data: {
                                                operation:
                                                    'Document bien signé',
                                            },
                                        }
                                    );

                                    resultRef.afterClosed().subscribe(() => {
                                        loadingRef.close();
                                        this.back.emit('ok');
                                        // this.signReqRef.close();
                                    });
                                },
                                (reqSigErr) => {
                                    signReqRef.componentInstance.verificationErr =
                                        reqSigErr.error;
                                    console.error(reqSigErr);
                                }
                            );
                    });
                });
        });
    }

    pageRendered(e) {
        this.docSize.h = e['source']['viewport']['height'];
        this.docSize.w = e['source']['viewport']['width'];
    }

    afterLoadComplete(pdf: PDFDocumentProxy) {
        this.totalPages = pdf.numPages;
        this.pages = new Array<any>(pdf.numPages);
        this.isLoaded = true;
    }

    goPage(page) {
        this.page = page;
    }

    mySignature() {
        if (this.sign.UserSignature) {
            const arr = this.sign.UserSignature.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const file = new Blob([u8arr], { type: mime });
            this.signFile = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.signGraphic = reader.result as string;

                const nativeEl = this.child?.nativeElement;

                this.position.x = nativeEl?.offsetLeft || 0;
                this.position.y = 10;
                this.showSign = true;
            };

            reader.readAsDataURL(file);
        }
    }

    compressImage(src, newX, newY) {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = newX;
                elem.height = newY;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, newX, newY);
                const data = ctx.canvas.toDataURL();

                const arr = data.split(','),
                    mime = arr[0].match(/:(.*?);/)[1];
                let bstr = atob(arr[1]);
                let n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const file = new Blob([u8arr], { type: mime });
                res(file);
            };
            img.onerror = (error) => rej(error);
        });
    }

    dropdownOpen = false;
    dropdownOpenSign = false;

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }
    toggleDropdownSign() {
        this.dropdownOpenSign = !this.dropdownOpenSign;
    }
}
