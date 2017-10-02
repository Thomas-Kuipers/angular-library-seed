import {
  async,
  TestBed,
} from '@angular/core/testing';

import {AdaptiveService} from "../../services/adaptive/adaptive.service";
import {ReplaySubject} from "rxjs/Rx";
import {createTestComponent, TestComponent} from "../create-test-component";
import {IfDevicesDirective} from "./if-devices.directive";

describe('IfDevicesDirective', () => {
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
        IfDevicesDirective,
        TestComponent
      ]
    });
  };

  it('should compile when applied to a DOM node', async(() => {
    configureTestbed();

    const fixture = createTestComponent('<div *ifDevices="[]"></div>');
    expect(fixture).toBeDefined();
  }));

});
