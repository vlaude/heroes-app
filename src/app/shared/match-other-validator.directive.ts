import { FormControl } from '@angular/forms';

/**
 * https://gist.github.com/slavafomin/17ded0e723a7d3216fb3d8bf845c2f30
 */
export function matchOtherValidator(otherControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {
        if (!control.parent) {
            return null;
        }

        // Initializing the validator.
        if (!thisControl) {
            thisControl = control;
            otherControl = control.parent.get(otherControlName) as FormControl;
            if (!otherControl) {
                throw new Error(
                    'matchOtherValidator(): other control is not found in parent group'
                );
            }
            otherControl.valueChanges.subscribe(() => {
                thisControl.updateValueAndValidity();
            });
        }

        if (!otherControl) {
            return null;
        }

        if (otherControl.value !== thisControl.value) {
            return {
                matchOther: true,
            };
        }

        return null;
    };
}
