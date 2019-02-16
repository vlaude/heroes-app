import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../../shared/forbidden-name.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public version: string = environment.VERSION;

  registerFormSubmitted = false;

  registerForm = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(4),
      forbiddenNameValidator(['admin', 'administrator', 'administrateur', 'god', 'root', 'chow', 'vlaude'])
    ]],
    email: [''],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  onRegisterFromSubmit() {
    this.registerFormSubmitted = true;
    console.log(this.registerForm);
  }

}
