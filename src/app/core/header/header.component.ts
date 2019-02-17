import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../../shared/forbidden-name-validator.directive';
import { matchOtherValidator } from '../../shared/match-other-validator.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
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
    console.log(this.registerForm);
    console.log(this.registerForm.value);
  }

}
