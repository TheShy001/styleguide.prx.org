import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { DaterangeComponent } from './daterange.component';
import { DatepickerComponent } from './datepicker.component';

describe('DaterangeComponent', () => {
  let comp: DaterangeComponent;
  let fix: ComponentFixture<DaterangeComponent>
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DaterangeComponent,
        DatepickerComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DaterangeComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should emit rangeChanged event when from or to date is changed', () => {
    spyOn(comp.rangeChange, 'emit').and.callThrough();
    comp.onFromDateChange(new Date());
    expect(comp.rangeChange.emit).toHaveBeenCalledTimes(1);
    comp.onToDateChange(new Date());
    expect(comp.rangeChange.emit).toHaveBeenCalledTimes(2);
  })
})