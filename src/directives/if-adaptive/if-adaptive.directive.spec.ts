import {
  async,
  TestBed,
} from '@angular/core/testing';

import {AdaptiveService} from "../../services/adaptive/adaptive.service";
import {ReplaySubject} from "rxjs/Rx";
import {createTestComponent, TestComponent} from "../create-test-component";
import {IfAdaptiveDirective} from "./if-adaptive.directive";

describe('IfAdaptiveDirective', () => {
  let validation = new ReplaySubject<boolean>();

  const configureTestbed = () => {
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
        IfAdaptiveDirective,
        TestComponent
      ]
    });
  };

  it('should compile when applied to a DOM node', async(() => {
    configureTestbed();

    const fixture = createTestComponent('<div *ifAdaptive="{}"></div>');

    expect(fixture).toBeDefined();
  }));

  it('should not render before the conditions are validated', async(() => {
    configureTestbed();

    const fixture = createTestComponent('<div *ifAdaptive="{}"><span>do i exist</span></div>');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span).toBeNull();
  }));

  it('should not render when the conditions validate as false', async(() => {
    configureTestbed();

    const fixture = createTestComponent('<div *ifAdaptive="{}"><span>do i exist</span></div>');
    validation.next(false);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span).toBeNull();
  }));

  it('should render when the conditions validate as true', async(() => {
    configureTestbed();

    const fixture = createTestComponent('<div *ifAdaptive="{}"><span>do i exist</span></div>');
    validation.next(true);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span).toBeDefined();
  }));

});
