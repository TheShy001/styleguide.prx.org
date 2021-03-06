import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockHalService } from '../hal/mock/mock-hal.service';
import { DebugElement } from '@angular/core';
import { ImageLoaderComponent } from './image-loader.component';

describe('ImageLoaderComponent', () => {
  let comp: ImageLoaderComponent;
  let fix: ComponentFixture<ImageLoaderComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const cms: MockHalService = new MockHalService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageLoaderComponent]
    }).compileComponents().then(() => {

      fix = TestBed.createComponent(ImageLoaderComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  const waitFor = (event: any, callback: any) => {
    let originalFn = comp[event];
    spyOn(comp, event).and.callFake(function() {
      originalFn.apply(comp, arguments);
      callback();
    });
  };

  const mockDoc = (linkHref: string) => {
    let doc = cms.mock('prx:anything', {});
    if (linkHref) {
      doc.mock('prx:image', {_links: {enclosure: {href: linkHref}}});
    }
    return doc;
  };

  describe('from src', () => {

    it('renders the image src', (done: any) => {
      comp.src = 'http://fillmurray.com/10/10';
      waitFor('onLoad', () => {
        let imageEl = de.query(By.css('img'));
        expect(de.query(By.css('img')).nativeElement.getAttribute('src')).toEqual('http://fillmurray.com/10/10');
        expect(comp.background).toMatch('http://fillmurray.com/10/10');
        expect(comp.isPlaceholder).toBeFalsy();
        expect(comp.isError).toBeFalsy();
        done();
      });
      fix.detectChanges();
    });

    it('renders nothing if no src given', () => {
      expect(de.query(By.css('img'))).toBeNull();
    });

    it('renders an error for bad src', (done: any) => {
      comp.src = 'http://foo.bar/this/is/fake.jpg';
      waitFor('onError', () => {
        expect(de.query(By.css('img')).nativeElement.getAttribute('src')).toEqual('http://foo.bar/this/is/fake.jpg');
        expect(comp.isError).toBeTruthy();
        done();
      });
      fix.detectChanges();
    });

  });

  describe('from haldoc', () => {

    it('follows the prx:image', (done: any) => {
      comp.imageDoc = mockDoc('http://fillmurray.com/10/10');
      waitFor('onLoad', () => {
        expect(de.query(By.css('img')).nativeElement.getAttribute('src')).toEqual('http://fillmurray.com/10/10');
        expect(comp.background).toMatch('http://fillmurray.com/10/10');
        comp.imageDoc = mockDoc(null);
        comp.ngOnChanges(<any> {imageDoc: true});
        expect(comp.background).toBeNull();
        done();
      });

      // TODO: ngOnChanges not firing (https://github.com/angular/angular/issues/9866)
      comp.ngOnChanges(<any> {imageDoc: true});
      fix.detectChanges();
    });

    it('shows a placeholder for missing images', () => {
      comp.imageDoc = mockDoc(null);
      // TODO: ngOnChanges not firing (https://github.com/angular/angular/issues/9866)
      comp.ngOnChanges(<any> {imageDoc: true});
      expect(comp.isPlaceholder).toBeTruthy();
    });

    it('shows an error for bad enclosure href', (done: any) => {
      comp.imageDoc = mockDoc('http://foo.bar/this/is/fake.jpg');
      waitFor('onError', () => {
        expect(de.query(By.css('img')).nativeElement.getAttribute('src')).toEqual('http://foo.bar/this/is/fake.jpg');
        expect(comp.isError).toBeTruthy();
        done();
      });

      // TODO: ngOnChanges not firing (https://github.com/angular/angular/issues/9866)
      comp.ngOnChanges(<any> {imageDoc: true});
      fix.detectChanges();
    });

  });

});
