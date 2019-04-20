import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { forbiddenNameValidator } from '../../shared/forbidden-name-validator.directive';
import { matchOtherValidator } from '../../shared/match-other-validator.directive';
import { RegisterUser } from '../../models/register-user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngxs/store';
import { SetCurrentUser } from '../../ngxs/app.action';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    constructor(
        private store: Store,
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    registerFormSubmitted = false;

    registerForm = this.fb.group({
        username: [
            '',
            [
                Validators.required,
                Validators.minLength(4),
                forbiddenNameValidator([
                    'admin',
                    'administrator',
                    'administrateur',
                    'god',
                    'root',
                    'chow',
                    'vlaude',
                ]),
            ],
        ],
        email: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeat: [
            '',
            [
                Validators.required,
                Validators.minLength(6),
                matchOtherValidator('password'),
            ],
        ],
    });

    ngOnInit() {}

    onRegisterFormSubmit() {
        this.registerFormSubmitted = true;
        const registerUser: RegisterUser = {
            username: this.registerForm.value.username,
            email: this.registerForm.value.email || null,
            password: this.registerForm.value.password,
        };
        this.userService.registerUser(registerUser).subscribe(
            response => {
                this.registerFormSubmitted = false;
                this.store.dispatch(new SetCurrentUser(response.user));
                this.toastr.info('Vous êtes enregistré');
                this.router.navigate(['/login']);
            },
            error => {
                this.toastr.error(error.message);
            }
        );
    }
}
