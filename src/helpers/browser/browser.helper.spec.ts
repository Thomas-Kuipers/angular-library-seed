import { async, TestBed, getTestBed } from '@angular/core/testing';

import { BrowserHelper } from './browser.helper';
import { Injector } from '@angular/core';
import { USER_AGENT_STRING } from '../../injection-tokens';

const ipad: string =
  'Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, ' +
  'like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3';
const iphone: string =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 ' +
  '(KHTML, like Gecko) Mobile/11A501';
const macOSChrome: string =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, ' +
  'like Gecko) Chrome/61.0.3163.100 Safari/537.36';

describe('BrowserHelper', () => {
  let browserHelper: BrowserHelper;

  const configureTestbed = (userAgentString: string) => {
    TestBed.configureTestingModule({
      providers: [
        BrowserHelper,
        Injector,
        { provide: USER_AGENT_STRING, useValue: userAgentString }
      ]
    });

    const testBed = getTestBed();
    browserHelper = testBed.get(BrowserHelper);
  };

  // it(
  //   'should emit true when we test for Chrome, and the user is on macOS chrome',
  //   async(() => {
  //     configureTestbed(macOSChrome);
  //
  //     browserHelper
  //       .validate(['Chrome'])
  //       .subscribe(result => expect(result).toBe(true));
  //   })
  // );
});
