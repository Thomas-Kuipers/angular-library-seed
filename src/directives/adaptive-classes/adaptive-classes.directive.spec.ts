import {
  async,
  TestBed,
} from '@angular/core/testing';

import {AdaptiveService} from "../../services/adaptive/adaptive.service";
import {ReplaySubject} from "rxjs/Rx";
import {AdaptiveClassesDirective} from "./adaptive-classes.directive";
import {createTestComponent, TestComponent} from "../create-test-component";

describe('AdaptiveClassesDirective', () => {
  let validation: ReplaySubject<boolean>;

  const configureTestbed = () => {
    validation = new ReplaySubject<boolean>();

    class MockAdaptiveService {
      validate() {
        return validation.asObservable();
      }
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: AdaptiveService, useClass: MockAdaptiveService }
      ],
      declarations: [
        AdaptiveClassesDirective,
        TestComponent
      ]
    });
  };

  it('should compile when applied to a DOM node', async(() => {
    configureTestbed();

    const fixture = createTestComponent('<div [adaptiveClasses]="{}"></div>');

    expect(fixture).toBeDefined();
  }));

  it('should add a class when the conditions validate as true', async(() => {
    configureTestbed();

    const fixture = createTestComponent(`<div [adaptiveClasses]="{yolo: {minScreenWidth: 1}}">wat</div>`);
    validation.next(true);
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');
    expect(div.classList.contains('yolo')).toBe(true);
  }));

  it('should not add a class when the conditions validate as false', async(() => {
    configureTestbed();

    const fixture = createTestComponent(`<div [adaptiveClasses]="{yolo: {minScreenWidth: 1}}">wat</div>`);
    validation.next(false);
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');
    expect(div.classList.contains('yolo')).toBe(false);
  }));

  it('should remove a class when the conditions later evaluate to false', async(() => {
    configureTestbed();

    const fixture = createTestComponent(`<div [adaptiveClasses]="{yolo: {minScreenWidth: 1}}">wat</div>`);
    const div = fixture.nativeElement.querySelector('div');

    validation.next(true);
    fixture.detectChanges();
    expect(div.classList.contains('yolo')).toBe(true);

    validation.next(false);
    fixture.detectChanges();
    expect(div.classList.contains('yolo')).toBe(false);
  }));
});
