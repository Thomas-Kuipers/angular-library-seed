import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed
} from '@angular/core/testing';

import {DeviceHelper} from './device.helper';
import {Injector} from '@angular/core';
import {USER_AGENT_STRING} from '../../services/adaptive/adaptive.service';

const ipad: string = 'Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3';
const iphone: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A501';
const macOSChrome: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';

describe('DeviceHelper', () => {
  let deviceHelper: DeviceHelper;

  const configureTestbed = (userAgentString: string) => {

    TestBed.configureTestingModule({
      providers: [
        DeviceHelper,
        Injector,
        { provide: USER_AGENT_STRING, useValue: userAgentString }
      ]
    });

    const testBed = getTestBed();
    deviceHelper = testBed.get(DeviceHelper);
  };

  // it('should emit false when we test for mobile, but the user is on an ipad', async(() => {
  //   configureTestbed(ipad);
  //
  //   deviceHelper
  //     .validate(['mobile'])
  //     .subscribe((result) => expect(result).toBe(false));
  // }));
  //
  // it('should emit true when we test for tablet, and the user is on an ipad', async(() => {
  //   configureTestbed(ipad);
  //
  //   deviceHelper
  //     .validate(['tablet'])
  //     .subscribe((result) => expect(result).toBe(true));
  // }));
  //
  // it('should emit false when we test for tablet, but the user is on an iphone', async(() => {
  //   configureTestbed(iphone);
  //
  //   deviceHelper
  //     .validate(['tablet'])
  //     .subscribe((result) => expect(result).toBe(false));
  // }));
  //
  // it('should emit true when we test for mobile, and the user is on an iphone', async(() => {
  //   configureTestbed(iphone);
  //
  //   deviceHelper
  //     .validate(['mobile'])
  //     .subscribe((result) => expect(result).toBe(true));
  // }));
  //
  // it('should emit false when we test for desktop, but the user is on an iphone', async(() => {
  //   configureTestbed(iphone);
  //
  //   deviceHelper
  //     .validate(['desktop'])
  //     .subscribe((result) => expect(result).toBe(false));
  // }));
  //
  // it('should emit true when we test for desktop, and the user is on macOS chrome', async(() => {
  //   configureTestbed(macOSChrome);
  //
  //   deviceHelper
  //     .validate(['desktop'])
  //     .subscribe((result) => expect(result).toBe(true));
  // }));
  //
  // it('should emit true when we test for either desktop or tablet, and the user is on macOS chrome', async(() => {
  //   configureTestbed(macOSChrome);
  //
  //   deviceHelper
  //     .validate(['desktop', 'tablet'])
  //     .subscribe((result) => expect(result).toBe(true));
  // }));
  //
  // it('should emit true when we test for either mobile or tablet, and the user is on an iphone', async(() => {
  //   configureTestbed(iphone);
  //
  //   deviceHelper
  //     .validate(['tablet', 'mobile'])
  //     .subscribe((result) => expect(result).toBe(true));
  // }));
  //
  // it('should emit false when we test for either mobile or tablet, but the user is on macOS chrome', async(() => {
  //   configureTestbed(macOSChrome);
  //
  //   deviceHelper
  //     .validate(['tablet', 'mobile'])
  //     .subscribe((result) => expect(result).toBe(false));
  // }));
});
