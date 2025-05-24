import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ChangeDetectorRef,
    ViewEncapsulation
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseLoadingService } from 'shared/services/loading';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'fuse-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'fuseLoadingBar',
    standalone: true,
    imports: [NgIf, MatProgressBarModule],
})
export class FuseLoadingBarComponent implements OnChanges, OnInit, OnDestroy {
    @Input() autoMode: boolean = true;
    mode: 'determinate' | 'indeterminate' = 'indeterminate';
    progress: number = 0;
    show: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _fuseLoadingService: FuseLoadingService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Auto mode
        if ('autoMode' in changes) {
            // Set the auto mode in the service
            this._fuseLoadingService.setAutoMode(coerceBooleanProperty(changes.autoMode.currentValue));
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the mode observable
        this._fuseLoadingService.mode$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                this.mode = value;
                this._triggerChangeDetection();
            });

        // Subscribe to the progress observable
        this._fuseLoadingService.progress$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                this.progress = value;
                this._triggerChangeDetection();
            });

        // Subscribe to the show observable
        this._fuseLoadingService.show$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                this.show = value;
                this._triggerChangeDetection();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Trigger manual change detection
     */
    private _triggerChangeDetection(): void {
        this._changeDetectorRef.detectChanges();
    }
}
