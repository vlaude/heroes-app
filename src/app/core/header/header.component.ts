import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../../shared/forbidden-name-validator.directive';
import { matchOtherValidator } from '../../shared/match-other-validator.directive';
import { RegisterUser } from '../../models/register-user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }
  public version: string = environment.VERSION;

  registerFormSubmitted = false;

  registerForm = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(4),
      forbiddenNameValidator(['admin', 'administrator', 'administrateur', 'god', 'root', 'chow', 'vlaude'])
    ]],
    email: [''],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
    ]],
    repeat: ['', [
      Validators.required,
      Validators.minLength(6),
      matchOtherValidator('password')
    ]]
  });

  ngOnInit() {
  }

  onRegisterFromSubmit() {
    this.registerFormSubmitted = true;
    const registerUser: RegisterUser = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email || null,
      password: this.registerForm.value.password
    };
    this.userService.registerUser(registerUser).subscribe(console.log);
  }

}
