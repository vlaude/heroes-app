import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnListComponent } from './conn-list.component';

describe('ConnListComponent', () => {
    let component: ConnListComponent;
    let fixture: ComponentFixture<ConnListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConnListComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
