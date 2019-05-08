import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Credentials } from '../../models/credentials.model';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngxs/store';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    constructor(
        private store: Store,
        private fb: FormBuilder,
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    loginFormSubmitted = false;
    invalidCredentialsError = false;

    loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    ngOnInit() {
        this.authService.logout();
    }

    onLoginFormSubmit() {
        if (this.loginForm.invalid) {
            return;
        }
        this.loginFormSubmitted = true;
        const credentials: Credentials = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password,
        };
        this.authService.login(credentials).subscribe(
            response => {
                this.loginFormSubmitted = false;
                this.invalidCredentialsError = false;
                this.toastr.success(`You are logged as ${response.username}`, null, {
                    positionClass: 'toast-bottom-right',
                });
                this.router.navigate(['/']);
            },
            error => {
                this.loginFormSubmitted = false;
                // Si 401, crédentials incorrects
                this.invalidCredentialsError = error.status === 401;
                this.toastr.error(error.message);
            }
        );
    }
}
