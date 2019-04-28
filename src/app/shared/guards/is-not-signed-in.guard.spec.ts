import { TestBed, async, inject } from '@angular/core/testing';

import { IsNotSignedInGuard } from './is-not-signed-in.guard';

describe('IsNotSignedInGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [IsNotSignedInGuard],
        });
    });

    it('should ...', inject([IsNotSignedInGuard], (guard: IsNotSignedInGuard) => {
        expect(guard).toBeTruthy();
    }));
});
