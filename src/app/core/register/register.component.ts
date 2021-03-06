import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { forbiddenNameValidator } from '../../shared/forbidden-name-validator.directive';
import { matchOtherValidator } from '../../shared/match-other-validator.directive';
import { RegisterUser } from '../../shared/models/register-user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    registerFormSubmitted = false;
    usernameAlreadyTaken = false;

    registerForm = this.fb.group({
        username: [
            '',
            [
                Validators.required,
                Validators.minLength(4),
                forbiddenNameValidator(['admin', 'administrator', 'administrateur', 'god', 'root', 'chow', 'vlaude']),
            ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        repeat: ['', [Validators.required, Validators.minLength(8), matchOtherValidator('password')]],
    });

    ngOnInit() {}

    onRegisterFormSubmit() {
        this.registerFormSubmitted = true;
        const registerUser: RegisterUser = {
            username: this.registerForm.value.username,
            password: this.registerForm.value.password,
        };
        this.userService.registerUser(registerUser).subscribe(
            () => {
                this.registerFormSubmitted = false;
                this.toastr.info('You are registered');
                this.router.navigate(['/login']);
            },
            error => {
                this.registerFormSubmitted = false;
                // 409 -> Conflict
                this.usernameAlreadyTaken = error.status === 409;
                // this.toastr.error(error.message);
            }
        );
    }
}
