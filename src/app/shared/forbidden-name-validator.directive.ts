/** A hero's name can't match the given regular expression */
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function forbiddenNameValidator(forbiddenUsernames: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return forbiddenUsernames.indexOf(control.value.toLowerCase()) >= 0 ? { forbiddenName: true } : null;
    };
}
