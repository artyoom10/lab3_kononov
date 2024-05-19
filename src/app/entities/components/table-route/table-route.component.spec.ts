import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRouteComponent } from './table-route.component';

describe('TableRouteComponent', () => {
  let component: TableRouteComponent;
  let fixture: ComponentFixture<TableRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableRouteComponent]
    });
    fixture = TestBed.createComponent(TableRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
