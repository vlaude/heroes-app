import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Credentials } from '../../models/credentials.model';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SetCurrentUser } from '../../ngxs/app.action';
import { Store } from '@ngxs/store';

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
        private router: Router,
        private toastr: ToastrService
    ) {}

    loginFormSubmitted = false;

    loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    ngOnInit() {}

    onLoginFormSubmit() {
        this.loginFormSubmitted = true;
        const credentials: Credentials = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password,
        };
        this.authService.login(credentials).subscribe(
            response => {
                this.loginFormSubmitted = false;
                this.store.dispatch(new SetCurrentUser(response.profile));
                this.toastr.success(
                    `You are logged as ${response.profile.username}`
                );
                this.router.navigate(['/']);
            },
            error => {
                this.loginFormSubmitted = false;
                this.toastr.error(error.message);
            }
        );
    }
}
