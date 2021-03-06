import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../shared/shared.module';

import { AuthService } from '../auth/auth.service';
import { CallbackComponent } from './callback.component';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallbackComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [AuthService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
