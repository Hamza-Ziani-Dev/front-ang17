import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from 'shared/animations';
import { FuseAlertComponent, FuseAlertType } from 'shared/components/alert';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { User } from '../../models/User';
import { ConfigService } from 'app/components/services/config.service';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { RestApiService } from '../../services/rest-api.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from 'app/components/dialogs/loading/loading.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    animations: fuseAnimations,
    standalone: true,

    imports: [
        RouterLink,
        MaterialModuleModule,
        NgIf,
        CommonModule,
        // FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        FormsModule,
        TranslocoModule
    ],
    encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
    // name = environment.footer;
    year = new Date().getFullYear();
    // hidePassOublie = environment.hidePassOublie;
    // espaceEmetteurShow = environment.espaceEmetteurShow;
    loginForm: FormGroup;
    auth = 0;
    us: User = new User();
    isLoading: Boolean;
    credentials = {
        username: '',
        password: '',
    };

    constructor(
        private cookies: CookieService,
        public config: ConfigService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private service: RestApiService,
        private router: Router,
        private authService: AuthService,
        private dialog: MatDialog,
        private _translocoService : TranslocoService
    ) {}

    // goClient() {
    //     this.router.navigate([
    //         "this.router.navigateByUrl('/dashboardClient');",
    //     ]);
    //     this.router.navigateByUrl('/dashboardClient');
    // }
    ngOnInit(): void {
        localStorage.setItem('lang', 'fr');
        this.loginForm = this.fb.group({
            username: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                ]),
            ],
            password: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                ]),
            ],
            secondary: [
                false,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                ]),
            ],
        });
        if (this.cookies.check('JSESSIONID')) {
            // this.router.navigateByUrl('/dashboard');
        }
    }

    // Login :
    login() {
        const p = this.loginForm.value;
        sessionStorage.clear();
        if (p.secondary == false) {
            this.isLoading = true;
            this.service.login(p.username, p.password).subscribe({
                next: (resp) => {
                    this.isLoading = false;
                    if (resp['KOLIC'] === 'KOLIC') {
                        this.toastr.error('Licence', 'La Licence a Expiré');
                        return;
                    }
                    if (resp['fullName'] && resp['isClient'] == null) {
                        this.cookies.delete('JSESSIONID');
                        this.us = this.service.tst(this.us,JSON.parse(JSON.stringify(resp))
                        ); // Update user state
                        sessionStorage.setItem('uslog', JSON.stringify(resp)); // Store user log in session storage
                        if (resp) {
                            this.router.navigate(['/apps/courrier-recents']).then(() => {
                                window.location.reload();
                            });
                          }
                        this.authService.registerSuccessfulLogin(
                            p.username,
                            p.password,
                            resp['master']
                        );
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 200000);
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                    if (err.status === 0) {
                        this.auth = -2;
                    }
                    if (err.status === 401) {
                        this.auth = -1;
                        this.authService
                            .isValid(this.credentials.username)
                            .subscribe((r) => {
                                if (r === -1) {
                                    this.auth = -3;
                                }
                            });
                    }
                },
            });
        } else {
            const load = this.dialog.open(LoadingComponent, {
                data: {
                    message: "se connecter au profil secondaire",
                    title: "Attendre la connexion",
                },
                disableClose: true,
                panelClass: 'custom-dialog-container',
            });

            this.service.checkuser(p).subscribe({
                next: (user) => {
                    if (user['fromLdap'] === 1) {
                        this.service.getSecondaryUser(p.username, 'user').subscribe({
                                next: (resp) => {
                                    if (resp != null || resp != undefined) {
                                        this.cookies.set('secondary', 'true');
                                        this.us = this.service.tst(this.us,JSON.parse(JSON.stringify(resp))
                                        );
                                        sessionStorage.setItem('uslog', JSON.stringify(resp));
                                        localStorage.setItem('uslog', JSON.stringify(resp));


                                        this.router.navigate(['apps/dashboard']);

                                        this.authService.registerSuccessfulLogin(
                                            resp['username'],
                                            'User@123',
                                            resp['master']
                                        );
                                        load.close();

                                        setTimeout(() => {
                                            this.isLoading = false;
                                        }, 200000);
                                    } else {
                                        this.isLoading = false;
                                        this.auth = -4; // Handle case where response is null or undefined
                                    }
                                },
                                error: (err) => {
                                    this.isLoading = false; // Stop loading on error

                                    if (err.status === 0) {
                                        this.auth = -2; // Network error
                                    }
                                    if (err.status === 401) {
                                        this.auth = -1; // Unauthorized
                                        this.authService
                                            .isValid(this.credentials.username)
                                            .subscribe((r) => {
                                                if (r === -1) {
                                                    this.auth = -3; // Invalid user
                                                }
                                            });
                                    }
                                    if (err.status === 404) {
                                        this.auth = -4; // Not found
                                    }
                                },
                            });
                    } else {
                        this.service.getSecondaryUser(p.username, p.password)
                            .subscribe({
                                next: (resp) => {
                                    if (resp != null) {
                                        this.cookies.set('secondary', 'true');
                                        this.us = this.service.tst(this.us,JSON.parse(JSON.stringify(resp))
                                        );
                                        sessionStorage.setItem('uslog',JSON.stringify(resp)
                                        );
                                        this.router.navigate(['apps/dashboard']);
                                        this.authService.registerSuccessfulLogin(resp['username'],'User@123',resp['master']);
                                        load.close();

                                        setTimeout(() => {
                                            this.isLoading = false;
                                        }, 200000);
                                    } else {
                                        this.isLoading = false;
                                        this.auth = -4; // Handle case where response is null or undefined
                                    }
                                },
                                error: (err) => {
                                    load.close();
                                    this.isLoading = false; // Stop loading on error

                                    if (err.status === 0) {
                                        this.auth = -2; // Network error
                                    }
                                    if (err.status === 401) {
                                        this.auth = -1; // Unauthorized
                                        this.authService
                                            .isValid(this.credentials.username)
                                            .subscribe((r) => {
                                                if (r === -1) {
                                                    this.auth = -3; // Invalid user
                                                }
                                            });
                                    }
                                    if (err.status === 404) {
                                        this.auth = -4; // Not found
                                    }
                                },
                            });
                    }
                },
                error: (err) => {
                    load.close();
                    this.isLoading = false; // Stop loading on error

                    if (err.status === 0) {
                        this.auth = -2; // Network error
                    }
                    if (err.status === 401) {
                        this.auth = -1; // Unauthorized
                        this.authService
                            .isValid(this.credentials.username)
                            .subscribe((r) => {
                                if (r === -1) {
                                    this.auth = -3; // Invalid user
                                }
                            });
                    }
                    if (err.status === 404) {
                        this.auth = -4; // Not found
                    }
                },
            });
        }
    }

    toggle = false;

    toggleInput() {
        if (this.toggle == false) {
            this.toggle = true;
            document.getElementById('password').setAttribute('type', 'text');
        } else {
            this.toggle = false;
            document
                .getElementById('password')
                .setAttribute('type', 'password');
        }
    }
}
