import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Credentials } from '../../models/credentials.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    constructor(private fb: FormBuilder, private router: Router) {}

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
    }
}
