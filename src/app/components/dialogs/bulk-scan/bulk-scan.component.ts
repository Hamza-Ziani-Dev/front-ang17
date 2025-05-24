import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { environment } from 'environments/environment.development';
import { ConfigService } from 'app/components/services/config.service';
import { WsService } from 'app/components/sockets/ws.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AllConfigurationsService } from 'app/components/services/all-configurations.service';
import { ScanService } from 'app/components/services/scan.service';
import { BulkScannedImagesComponent } from '../bulk-scanned-images/bulk-scanned-images.component';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-bulk-scan',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule, TranslocoModule],
    templateUrl: './bulk-scan.component.html',
    styleUrl: './bulk-scan.component.scss',
})
export class BulkScanComponent {
    groupElements: any;
    currentLot: any;
    lotName: string;

    constructor(
        public dialogRef: MatDialogRef<BulkScanComponent>,
        private translocoService: TranslocoService,
        public config: ConfigService,
        public ws: WsService,
        private sanitizer: DomSanitizer,
        public configuration: AllConfigurationsService,
        private scanService: ScanService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // Access passed data
        this.groupElements = data.groupElements;
        this.currentLot = data.currentLot;
        this.lotName = data.lotName;
        this.ws.ws.onmessage = (e) => {
            //console.log(typeof e.data)
            if (typeof e.data === 'string') {
                // //console.log(e.data);
                const data = e.data;
                const commande = data.split('|')[0];
                const cmdValue = data.split('|')[1];
                if (commande) {
                    if (commande === 'userConfig') {
                        this.userConfigs = JSON.parse(cmdValue);
                    }
                    if (commande === 'sessionId') {
                        this.scanService.setScanSessionId = cmdValue;
                    }
                    if (commande === 'scannerCaps') {
                        this.scannerCaps = JSON.parse(cmdValue);
                        //console.log(this.scannerCaps);
                        this.userConfigs.paperSize =
                            this.scannerCaps.paperSizes[0];
                        this.userConfigs.dpi = this.scannerCaps.dpis[0];
                        this.userConfigs.depth = this.scannerCaps.depths[0];
                        this.userConfigs.feeder = this.scannerCaps.feeders[0];

                        this.loading = false;
                    }

                    if (commande === 'allconfigs') {
                        this.loadingScanners = false;
                        this.allScannersConfigs = JSON.parse(cmdValue);
                        console.info(this.allScannersConfigs);
                        if (this.allScannersConfigs.length > 0) {
                            //console.log(this.allScannersConfigs)
                            this.scannerCaps =
                                this.allScannersConfigs[0].ScannerCaps;
                            this.currentSource = this.allScannersConfigs[0];
                            if (this.allScannersConfigs[0].ScanParameters) {
                                if (
                                    this.allScannersConfigs[0].ScanParameters
                                        .depth
                                ) {
                                    this.depthChanged({
                                        target: {
                                            value: this.allScannersConfigs[0]
                                                .ScanParameters.depth,
                                        },
                                    });
                                    this.selectedDepth =
                                        this.allScannersConfigs[0].ScanParameters.depth;
                                }
                                if (
                                    this.allScannersConfigs[0].ScanParameters
                                        .dpi
                                ) {
                                    this.dpiChanged({
                                        target: {
                                            value: this.allScannersConfigs[0]
                                                .ScanParameters.dpi,
                                        },
                                    });

                                    this.selectedDpi =
                                        this.allScannersConfigs[0].ScanParameters.dpi;
                                }
                                if (
                                    this.allScannersConfigs[0].ScanParameters
                                        .paperSize
                                ) {
                                    this.paperSizeChanged({
                                        target: {
                                            value: this.allScannersConfigs[0]
                                                .ScanParameters.paperSize,
                                        },
                                    });
                                    this.selectedPaperSize =
                                        this.allScannersConfigs[0].ScanParameters.paperSize;
                                }

                                if (
                                    this.allScannersConfigs[0].ScanParameters
                                        .duplex
                                ) {
                                    this.duplexChanged(
                                        this.allScannersConfigs[0]
                                            .ScanParameters.duplex
                                    );
                                    this.selectedDuplex =
                                        this.allScannersConfigs[0].ScanParameters.duplex;
                                }
                                if (
                                    this.allScannersConfigs[0].ScanParameters
                                        .feeder
                                ) {
                                    this.feederChanged({
                                        target: {
                                            value: this.allScannersConfigs[0]
                                                .ScanParameters.feeder,
                                        },
                                    });
                                    this.selectedFeeder =
                                        this.allScannersConfigs[0].ScanParameters.feeder;
                                }
                            } else {
                                this.paperSizeChanged({
                                    target: { value: 'A4' },
                                });
                                this.dpiChanged({ target: { value: 200 } });
                                this.depthChanged({
                                    target: { value: 'BlackWhite' },
                                });
                                this.duplexChanged(false);
                                this.selectedPaperSize = 'A4';
                                this.selectedDpi = 200;
                                this.selectedDepth = 'BlackWhite';
                                this.selectedDuplex = false;
                                this.selectedFeeder = 'ADF';
                            }
                        }

                        this.loading = false;
                    }
                }
                //console.log(e.data);
                this.loading = false;
                if (data === 'err') {
                    this.message = 'Une erreur est survenue';
                } else if (data === '0scanner') {
                    this.message = "Aucun scanner n'a été détécté";
                } else if (data.startsWith('data')) {
                    this.tiffs.push(data);
                    this.tiffs.slice(0);
                    //console.log(this.tiffs)
                }
            } else if (e.data instanceof Blob) {
                this.isScaning = true;
                let reader = new FileReader();

                reader.onload = () => {
                    const result = reader.result as string;
                    const page = this.imagesPages.size;
                    if (result.match('application/octet-stream').length > 0) {
                        const index = this.i;
                        this.scanedImages.push({
                            index,
                            name: 'page' + ++this.i,
                            image: result.replace(
                                'application/octet-stream',
                                'image/tiff'
                            ),
                        });
                        this.scanedImages.slice(0);
                    }

                    this.setOnScanIfNotNull(this.refScannedImgs, false);
                    //this.generateThumbnail(reader.result as string);

                    //this.refereshPage()
                };
                reader.readAsDataURL(e.data);
                //console.log(this.scanedImages)

                if (!this.isPopuping) {
                    this.isPopuping = true;
                    this.onScan = false;
                    this.refScannedImgs = this.dialog.open( BulkScannedImagesComponent,
                        {
                            disableClose: true,
                        }
                    );
                    this.refScannedImgs = this.dialog.open(BulkScannedImagesComponent,
                        {
                            disableClose: true,
                        }
                    );
                    this.refScannedImgs.componentInstance.imgsList =
                        this.scanedImages;
                    this.refScannedImgs.componentInstance.thumbs =
                        this.tumblains;
                    this.refScannedImgs.componentInstance.compressedTiff =
                        this.tiffs;
                    this.refScannedImgs.componentInstance.onScan = this.onScan;
                    this.refScannedImgs.componentInstance.cureentLot =
                        this.data.cureentLot;
                    this.refScannedImgs.componentInstance.lotName =
                        this.lotName;
                    this.refScannedImgs.componentInstance.groupElements =
                        this.groupElements;
                    this.refScannedImgs.componentInstance.src = 's';
                    this.refScannedImgs.componentInstance.scanAgain.subscribe(
                        (res) => {
                            this.onSubmit();
                        }
                    );

                    this.refScannedImgs.componentInstance.passConverted.subscribe(
                        (res) => {
                            if (res) {
                                this.data.passEntry.emit(res);
                                this.refScannedImgs.dismiss();
                            } else if (res == null) {
                                this.scanedImages = new Array<any>();
                                this.tumblains = new Array<any>();
                                this.tiffs = new Array<any>();
                                this.i = 0;
                                this.isPopuping = false;
                                this.data.passEntry.emit(res);
                                this.refScannedImgs.dismiss();
                            }
                        }
                    );
                }
            }
        };
    }

    closeDialog(file: any) {
        this.dialogRef.close(file); 
    }

    firstPage = 0;
    tumblains = new Array<any>();
    env = environment;
    i = 0;
    lastI = -1;
    //   @Output() passEntry = new EventEmitter();
    //   @Input() mode;
    //   @Input() cureentLot;
    //   @Input() lotName;
    //   @Input() groupElements;
    loading = true;
    message = '';
    isPopuping = false;
    imagesPages = new Map<number, Array<any>>();
    onScan = false;

    tiffs = new Array<any>();
    scanedImages: Array<any> = new Array<any>();
    pagesCount: number;

    allScannersConfigs;
    isScaning = false;
    userConfigs;
    scannerCaps: any;
    scanParams: any = {
        dpi: '',
        depth: '',
        paperSize: '',
        duplex: false,
        feeder: 'ADF',
    };
    currentSource: any;
    scanOption: any;
    loadingScanners = true;
    refereshPage() {}
    ngOnInit(): void {
        console.log(this.data.cureentLot);
    }
    refScannedImgs: any;
    onScanFromCapture(e) {
        let refScannedImgs;
        // if (!this.isPopuping) {
        //   this.scanedImages.push({ name: 'page' + (++this.i), image: e.data })
        //   this.isPopuping = true;
        //   refScannedImgs = this.popup.open(ScannedImagesComponent, { centered: true, size: 'lg', backdrop: "static" });
        // }
        // refScannedImgs.componentInstance.imgsList = this.scanedImages;
    }

    onDataFromCapture(e) {
        this.tiffs.push(e.data);
        this.scanedImages.push({ name: 'page' + ++this.i, image: e.data });
        if (!this.isPopuping) {
            this.isPopuping = true;
            this.refScannedImgs = this.dialog.open(BulkScannedImagesComponent, {
                disableClose: true,
            });

            this.refScannedImgs.componentInstance.imgsList = this.scanedImages;
            this.refScannedImgs.componentInstance.compressedTiff = this.tiffs;

            this.refScannedImgs.componentInstance.passConverted.subscribe(
                (res) => {
                    if (res) {
                        //console.log('res')
                        this.data.passEntry.emit(res);
                        this.refScannedImgs.dismiss();
                    } else {
                        this.isPopuping = false;
                        this.scanedImages = new Array<any>();
                        this.i = 0;
                    }
                }
            );
        }
    }

    scanOptionChange(e, opt) {
        console.log('change ', opt);

        this.scanOption = opt;
    }

    params() {
        //console.log("paer")

        if (this.allScannersConfigs.length > 0) {
            //console.log("par")
            let par = document.getElementById('scanparams');
            par.classList.toggle('hide__params');
        }
    }

    refreshpages() {
        const size = this.scanedImages.length;
        this.pagesCount = size / 10;
        let CurrentPage = new Array<any>();

        for (let index = 0; index < this.pagesCount; index++) {
            CurrentPage.push(this.scanedImages.slice(index));
        }
    }

    sourceChanged(e) {
        //console.log(e)
        let i = e.target.value;
        if (i) {
            this.currentSource = this.allScannersConfigs[i];
            this.scannerCaps = this.allScannersConfigs[i].ScannerCaps;
        }
    }
    close() {
        this.data.passEntry.emit(null);
    }
    selectedDpi = 100;
    selectedDepth;
    selectedPaperSize;
    selectedDuplex = false;
    selectedFeeder;
    depthChanged(e) {
        this.scanParams.depth = e.target.value;
        console.log('e.target.value : ', e.target.value, this.scanParams);
    }
    dpiChanged(e) {
        this.scanParams.dpi = e.target.value;
        console.log('e.target.value : ', e.target.value, this.scanParams);
    }
    paperSizeChanged(e) {
        this.scanParams.paperSize = e.target.value;
        console.log('e.target.value : ', e.target.value, this.scanParams);
    }
    duplexChanged(is) {
        this.scanParams.duplex = is;
    }

    feederChanged(e) {
        this.scanParams.feeder = e.target.value;
        console.log('e.target.value : ', e.target.value, this.scanParams);
    }
    onCancel() {
        this.dialogRef.close();
        this.onScan = false;
        this.setOnScanIfNotNull(this.refScannedImgs, this.onScan);
    }
    onSubmit() {
        if (this.ws.isOpen && this.allScannersConfigs) {
            if (this.allScannersConfigs.length > 0) {
                this.currentSource.ScanParameters = this.scanParams;
                this.ws.newScaning(
                    this.currentSource,
                    this.scanService.scanSessionId
                );
                this.onScan = true;
                this.setOnScanIfNotNull(this.refScannedImgs, this.onScan);
            }
        }
    }

    ngOnDestroy(): void {
        this.scanService.setScanSessionId = '';
    }

    reload() {
        location.reload();
    }

    stopScan() {
        this.ws.ws.send('stop|d');
    }
    AllSettings() {
        this.ws.ws.send('allsettings|d');
    }

    setOnScanIfNotNull(
        popRef: MatDialogRef<BulkScannedImagesComponent> | null,
        value: any
    ) {
        if (popRef) {
            popRef.componentInstance.data.onScan = value; 
        }
    }
}
