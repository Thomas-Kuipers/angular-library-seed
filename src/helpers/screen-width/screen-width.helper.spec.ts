import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { ScreenWidthHelper } from './screen-width.helper';
import {WindowRefHelper} from "../window-ref/window-ref";

describe('ScreenWidthHelper', () => {
  let mockWindowRef: WindowRefHelper;
  let screenWidthHelper: ScreenWidthHelper;

  const configureTestbed = async(() => {
    // async(() => {
      TestBed.configureTestingModule({
        providers: [
          ScreenWidthHelper,
          {provide: WindowRefHelper, useClass: mockWindowRef }
        ]
      });

      const testBed = getTestBed();
      screenWidthHelper = testBed.get(ScreenWidthHelper);
      console.log('after testbed get')
    // });
  });

  console.log('wat wat wat');

  it('should be okay', async(() => {
      console.log('inside async')
      mockWindowRef = {
        nativeWindow: {innerWidth: 500}
      };

      configureTestbed();

      console.log(screenWidthHelper);

      screenWidthHelper
        .validateMax(400)
        .subscribe(result => expect(result).toBe(true));
  }));


});
