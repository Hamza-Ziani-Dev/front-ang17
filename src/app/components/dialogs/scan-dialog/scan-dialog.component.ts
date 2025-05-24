import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AllConfigurationsService } from 'app/components/services/all-configurations.service';
import { ConfigService } from 'app/components/services/config.service';
import { WsService } from 'app/components/sockets/ws.service';
import { ScanService } from 'app/components/services/scan.service';
import { ScannedImagesDialogComponent } from '../scanned-images-dialog/scanned-images-dialog.component';
import { environment } from 'environments/environment.development';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { CaptureComponent } from 'app/components/apps/capture/capture.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-scan-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        CaptureComponent,
        TranslocoModule,
    ],
    templateUrl: './scan-dialog.component.html',
    styleUrl: './scan-dialog.component.scss',
})
export class ScanDialogComponent implements OnInit, OnDestroy {
    firstPage = 0;
    tumblains = new Array<any>();
    env = environment;
    i = 0;
    lastI = -1;
    @Output() passEntry = new EventEmitter();
    @Input() mode;
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
        feeder: '',
        depth: '',
        paperSize: '',
        duplex: false,
    };
    currentSource: any;
    scanOption: number = 1;
    loadingScanners = true;
    isParamsVisible: boolean = false;
    refScannedImgs: MatDialogRef<ScannedImagesDialogComponent> | null = null;
    constructor(
        public config: ConfigService,
        public ws: WsService,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        public configuration: AllConfigurationsService,
        public scanService: ScanService,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<ScanDialogComponent>
    ) {
        this.ws.ws.onmessage = (e) => {
            console.log({ type: typeof e.data, data: e.data });
            if (typeof e.data === 'string') {
                // //console.log(e.data);
                const data = e.data;
                const commande = data.split('|')[0];
                const cmdValue = data.split('|')[1];
                if (commande) {
                    if (commande === 'sessionId') {
                        this.scanService.setScanSessionId = cmdValue;
                    }
                    if (commande === 'userConfig') {
                        this.userConfigs = JSON.parse(cmdValue);
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
                        this.allScannersConfigs = JSON.parse(cmdValue);
                        console.info(this.allScannersConfigs);
                        if (this.allScannersConfigs.length > 0) {
                            this.loadingScanners = false;
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
                                this.feederChanged({
                                    target: { value: 'ADF' },
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
                        this.scanedImages.push({
                            name: 'page' + ++this.i,
                            image: result.replace(
                                'application/octet-stream',
                                'image/tiff'
                            ),
                        });
                        this.scanedImages.slice(0);
                    }
                    this.setOnScanIfNotNull(this.refScannedImgs, false);
                };
                reader.readAsDataURL(e.data);
                if (!this.isPopuping) {
                    this.isPopuping = true;
                    this.onScan = false;
                    const dialogRef = this.dialog.open(
                        ScannedImagesDialogComponent,
                        {
                            disableClose: true, // Replaces `backdrop: "static"`
                            data: {
                                imgsList: this.scanedImages,
                                thumbs: this.tumblains,
                                compressedTiff: this.tiffs,
                                onScan: this.onScan,
                                src: 's',
                            },
                        }
                    );

                    dialogRef.componentInstance.scanAgain.subscribe(() => {
                        this.onSubmit();
                    });
                    dialogRef.componentInstance.passConverted.subscribe(
                        (res) => {
                            console.log('res', res);
                            if (res) {
                                this.passEntry.emit(res);
                                dialogRef.close();
                            } else if (res === null) {
                                this.scanedImages = [];
                                this.tumblains = [];
                                this.tiffs = [];
                                this.i = 0;
                                this.isPopuping = false;
                            }
                        }
                    );

                    dialogRef.afterClosed().subscribe(() => {
                        this.isPopuping = false;
                    });
                }
            }
        };
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.scanService.setScanSessionId = '';
    }

    refereshPage() {}

    onScanFromCapture(e) {
        let refScannedImgs;
    }

    onDataFromCapture(e: any): void {
        this.tiffs.push(e.data);
        this.scanedImages.push({ name: 'page' + ++this.i, image: e.data });
        if (!this.isPopuping) {
            this.isPopuping = true;

            this.refScannedImgs = this.dialog.open(
                ScannedImagesDialogComponent,
                {
                    width: '800px', // Replace size: 'lg'
                    disableClose: true, // Replace backdrop: "static"
                    data: {
                        imgsList: this.scanedImages,
                        compressedTiff: this.tiffs,
                    },
                }
            );
            // Handle dialog outputs
            this.refScannedImgs.componentInstance.passConverted.subscribe(
                (res) => {
                    if (res) {
                        this.passEntry.emit(res);
                        this.refScannedImgs?.close(); // Close dialog
                    } else {
                        this.isPopuping = false;
                        this.scanedImages = [];
                        this.i = 0;
                        this.refScannedImgs?.close(); // Close dialog
                    }
                }
            );

            // Cleanup after the dialog is closed
            this.refScannedImgs.afterClosed().subscribe(() => {
                this.isPopuping = false;
            });
        }
    }

    // Change Capture Or Scan :
    scanOptionChange(e, opt) {
        console.log('change ', opt);
        this.scanOption = opt;
    }

    // Toggle Params :
    toggleParams() {
        if (this.allScannersConfigs.length > 0) {
            this.isParamsVisible = !this.isParamsVisible;
        }
    }

    // Refresh Page:
    refreshpages() {
        const size = this.scanedImages.length;
        this.pagesCount = size / 10;
        let CurrentPage = new Array<any>();

        for (let index = 0; index < this.pagesCount; index++) {
            CurrentPage.push(this.scanedImages.slice(index));
        }
    }

    sourceChanged(e) {
        let i = e.target.value;
        if (i) {
            this.currentSource = this.allScannersConfigs[i];
            this.scannerCaps = this.allScannersConfigs[i].ScannerCaps;
        }
    }
    close() {
        this.passEntry.emit(null);
    }
    selectedDpi = 100;
    selectedDepth;
    selectedPaperSize;
    selectedFeeder;
    selectedDuplex = false;
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

    feederChanged(e) {
        this.scanParams.feeder = e.target.value;
        console.log('e.target.value : ', e.target.value, this.scanParams);
    }

    duplexChanged(is) {
        this.scanParams.duplex = is;
    }
    onCancel(): void {
        if (this.refScannedImgs) {
            this.refScannedImgs.close(); // Close the dialog
        }
        this.onScan = false;
        this.setOnScanIfNotNull(this.refScannedImgs, this.onScan);
    }

    // On Sumbit :
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

    // Reload :
    reload() {
        location.reload();
    }

    // Stop Scan :
    stopScan() {
        this.ws.ws.send('stop|d');
    }

    AllSettings() {
        this.ws.ws.send('allsettings|d');
    }

    setOnScanIfNotNull(
        popRef: MatDialogRef<ScannedImagesDialogComponent> | null = this
            .refScannedImgs,
        value: any
    ): void {
        if (popRef) {
            popRef.componentInstance.onScan = value;
        }
    }
}
