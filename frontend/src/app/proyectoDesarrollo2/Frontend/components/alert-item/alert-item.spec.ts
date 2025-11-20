import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertItem } from './alert-item';

describe('AlertItem', () => {
  let component: AlertItem;
  let fixture: ComponentFixture<AlertItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
