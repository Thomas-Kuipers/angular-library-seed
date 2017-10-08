import { async, TestBed, getTestBed } from '@angular/core/testing';

import { ScreenWidthHelper, ScreenWidthSpec } from './screen-width.helper';
import { WindowRefHelper } from '../window-ref/window-ref';
import { Injector } from '@angular/core';
import { SCREEN_WIDTH_BREAKPOINTS } from '../../injection-tokens';
import { DEBOUNCE_TIME } from '../../injection-tokens';

const defaultScreenWidths: ScreenWidthSpec[] = [
  { max: 575, name: 'xs' },
  { max: 767, name: 's' },
  { max: 991, name: 'm' },
  { max: 1199, name: 'l' },
  { max: null, name: 'xl' }
];

describe('ScreenWidthHelper', () => {
  let screenWidthHelper: ScreenWidthHelper;

  const configureTestbed = (innerWidth: number) => {
    const mockWindowRef: WindowRefHelper = {
      nativeWindow: {
        innerWidth,
        onresize: () => {},
        addListener: () => {},
        removeListener: () => {}
      }
    };

    TestBed.configureTestingModule({
      providers: [
        ScreenWidthHelper,
        Injector,
        { provide: WindowRefHelper, useValue: mockWindowRef },
        { provide: DEBOUNCE_TIME, useValue: 0 },
        { provide: SCREEN_WIDTH_BREAKPOINTS, useValue: defaultScreenWidths }
      ]
    });

    const testBed = getTestBed();
    screenWidthHelper = testBed.get(ScreenWidthHelper);
  };

  it(
    'should emit false when the screen is 200 and the max is 100',
    async(() => {
      configureTestbed(200);

      screenWidthHelper
        .validateMax(100)
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when the screen is 100 and the max is 200',
    async(() => {
      configureTestbed(100);

      screenWidthHelper
        .validateMax(200)
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit true when the screen is 200 and the max is 200',
    async(() => {
      configureTestbed(200);

      screenWidthHelper
        .validateMax(200)
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when the screen is 100 and the min is 200',
    async(() => {
      configureTestbed(100);

      screenWidthHelper
        .validateMin(200)
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when the screen is 100 and the min is 100',
    async(() => {
      configureTestbed(100);

      screenWidthHelper
        .validateMin(100)
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit true when the screen is 200 and the min is 100',
    async(() => {
      configureTestbed(200);

      screenWidthHelper
        .validateMin(100)
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when the screen is "s" and the min is "m"',
    async(() => {
      configureTestbed(576);

      screenWidthHelper
        .validateMin('m')
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when the screen is "m" and the min is "s"',
    async(() => {
      configureTestbed(768);

      screenWidthHelper
        .validateMin('s')
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when the screen is "m" and the max is "s"',
    async(() => {
      configureTestbed(768);

      screenWidthHelper
        .validateMax('s')
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when the screen is "s" and the max is "m"',
    async(() => {
      configureTestbed(767);

      screenWidthHelper
        .validateMax('m')
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit true when the screen is "m" and the max is "m"',
    async(() => {
      configureTestbed(991);

      screenWidthHelper
        .validateMax('m')
        .subscribe(result => expect(result).toBe(true));
    })
  );
});
