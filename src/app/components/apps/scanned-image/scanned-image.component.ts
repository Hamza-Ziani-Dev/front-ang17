import { AfterViewInit, Component, ElementRef,SimpleChanges,OnChanges,Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-scanned-image',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './scanned-image.component.html',
  styleUrl: './scanned-image.component.scss'
})
export class ScannedImageComponent implements AfterViewInit , OnChanges {
    @Input() imgPath: string;

    @ViewChild('element') element: ElementRef;
    thumb;
    public img;
    public parentSize;
    isCompleted = false;

    constructor(
        private translocoService: TranslocoService,
    ) {}


    // Lifecycle hook that detects changes in @Input properties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imgPath'] && changes['imgPath'].currentValue) {

    }
  }
    ngAfterViewInit() {
        this.compressImage(this.imgPath, 140 * 1.5, 200 * 1.5)
        .then(compressed => {
            // console.log('Compressed image:', compressed);
            this.thumb = compressed;
            this.isCompleted = true;
            // console.log('this.thumb', this.thumb);
            // console.log('Compressed image:', this.isCompleted);
        })
        .catch(error => {
            console.error('Compression error:', error);
            this.isCompleted = false;
            console.log('Compression error', this.isCompleted);
        });

      //this.generateThumbnail();
    //   this.compressImage(this.imgPath, 140*1.5, 200*1.5).then(compressed => {
    //     this.thumb = compressed;
    //     this.isCompleted=true;
    //   })



    //   console.log('ngAfterViewInit:', this.imgPath);


    }

    compressImage(src: string, newX: number, newY: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Ensures cross-origin images can be processed
            img.src = src;

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = newX;
                    canvas.height = newY;
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        ctx.drawImage(img, 0, 0, newX, newY);
                        const compressedData = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality (0.0 - 1.0)
                        resolve(compressedData);
                    } else {
                        reject(new Error('Canvas context could not be created.'));
                    }
                } catch (error) {
                    reject(new Error(`Error during compression: ${error.message}`));
                }
            };

            img.onerror = () => reject(new Error('Failed to load the image.'));
        });
    }


    //  compressImage(src, newX, newY) {
    //   return new Promise((res, rej) => {
    //     const img = new Image();
    //     img.src = src;
    //     img.onload = () => {
    //       //console.log("enter ss")
    //       const elem = document.createElement('canvas');
    //       elem.width = newX;
    //       elem.height = newY;
    //       const ctx = elem.getContext('2d');
    //       ctx.drawImage(img, 0, 0, newX, newY);
    //       const data = ctx.canvas.toDataURL();
    //       //console.log("enter ff")
    //       res(data);
    //     }
    //     img.onerror = error => rej(error);
    //   })
    // }
  }
