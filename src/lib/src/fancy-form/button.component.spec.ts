import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { ButtonComponent } from './button.component';
import { SpinnerModule } from '../spinner/spinner.module';

class MockModel {
  isSaving = false;
  isInvalid = false;
  isChanged = false;
  invalid() { return this.isInvalid; }
  changed() { return this.isChanged; }
  constructor(opts: any = {}) {
    this.isSaving = opts.saving || false;
    this.isInvalid = opts.invalid || false;
    this.isChanged = opts.changed || false;
  }
}

@Component({
  selector: 'test-component',
  template: `
    <prx-button [model]="model" [working]="working" [disabled]="disabled" [visible]="visible" (click)="onClick()">
      Save
    </prx-button>
  `
})
class TestComponent {
  model: MockModel;
  working: boolean;
  disabled: boolean;
  visible: boolean;

  onClick(): void {}
}
describe('ButtonComponent', () => {
  let comp: TestComponent;
  let fix: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerModule],
      declarations: [ButtonComponent, TestComponent]
    }).compileComponents().then(() => {

      fix = TestBed.createComponent(TestComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('hides, disables and is not working by default', () => {
    comp.model = new MockModel();
    fix.detectChanges();
    expect(de.query(By.css('button'))).toBeNull();
    comp.visible = true;
    fix.detectChanges();
    expect(de.query(By.css('button'))).not.toBeNull();
    expect(de.query(By.css('button')).nativeElement.getAttribute('disabled')).toBeNull();
    expect(de.query(By.css('button.working'))).toBeNull();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
  });

  describe('visible', () => {

    it('is hidden by default', () => {
      comp.model = new MockModel();
      fix.detectChanges();
      expect(de.query(By.css('button'))).toBeNull();
    });

    it('is shown when changed', () => {
      comp.model = new MockModel({changed: true});
      fix.detectChanges();
      expect(de.query(By.css('button'))).not.toBeNull();
    });

    it('can override visibility', () => {
      comp.model = new MockModel();
      comp.visible = true;
      fix.detectChanges();
      expect(de.query(By.css('button'))).not.toBeNull();
    });

  });

  describe('disabled', () => {

    it('is disabled when saving', () => {
      comp.model = new MockModel({changed: true, saving: true});
      fix.detectChanges();
      expect(de.query(By.css('button')).nativeElement.getAttribute('disabled')).not.toBeNull();
    });

    it('is disabled when invalid', () => {
      comp.model = new MockModel({changed: true, invalid: true});
      fix.detectChanges();
      expect(de.query(By.css('button')).nativeElement.getAttribute('disabled')).not.toBeNull();
    });

    it('is disabled when working', () => {
      comp.model = new MockModel({changed: true});
      comp.working = true;
      fix.detectChanges();
      expect(de.query(By.css('button')).nativeElement.getAttribute('disabled')).not.toBeNull();
    });

    it('can override disabled', () => {
      comp.model = new MockModel({changed: true});
      comp.disabled = true;
      fix.detectChanges();
      expect(de.query(By.css('button')).nativeElement.getAttribute('disabled')).not.toBeNull();
    });

  });

  describe('working', () => {

    it('shows working indicators when saving', () => {
      comp.model = new MockModel({changed: true, saving: true});
      fix.detectChanges();
      expect(de.query(By.css('button.working'))).not.toBeNull();
      expect(de.query(By.css('prx-spinner'))).not.toBeNull();
    });

    it('can override working', () => {
      comp.model = new MockModel({changed: true});
      comp.working = true;
      fix.detectChanges();
      expect(de.query(By.css('button.working'))).not.toBeNull();
      expect(de.query(By.css('prx-spinner'))).not.toBeNull();
    });

    it('prevents double click resulting in double submit when working', () => {
      spyOn(comp, 'onClick');
      comp.model = new MockModel({changed: true});
      comp.working = false;
      fix.detectChanges();
      de.query(By.css('button')).nativeElement.click();
      comp.working = true;
      fix.detectChanges();
      de.query(By.css('button')).nativeElement.click();
      expect(comp.onClick).toHaveBeenCalledTimes(1);
    });

  });

});
