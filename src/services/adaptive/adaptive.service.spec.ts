import { async, TestBed, getTestBed } from '@angular/core/testing';

import { AdaptiveRule, AdaptiveService } from './adaptive.service';
import { DeviceHelper } from '../../helpers/device/device.helper';
import { OrientationHelper } from '../../helpers/orientation/orientation.helper';
import { ScreenWidthHelper } from '../../helpers/screen-width/screen-width.helper';
import { Observable } from 'rxjs/Observable';
import { ADAPTIVE_RULES } from '../../injection-tokens';

describe('AdaptiveService', () => {
  let adaptiveService: AdaptiveService;

  const configureTestbed = (results: any, rules: AdaptiveRule[] = []) => {
    class MockDeviceHelper {
      public validate() {
        return Observable.of(results.devices);
      }
    }

    class MockOrientationHelper {
      public validate() {
        return Observable.of(results.orientation);
      }
    }

    class MockScreenWidthHelper {
      public validateMin() {
        return Observable.of(results.minScreenWidth);
      }

      public validateMax() {
        return Observable.of(results.maxScreenWidth);
      }
    }

    TestBed.configureTestingModule({
      providers: [
        AdaptiveService,
        { provide: DeviceHelper, useClass: MockDeviceHelper },
        { provide: OrientationHelper, useClass: MockOrientationHelper },
        { provide: ScreenWidthHelper, useClass: MockScreenWidthHelper },
        { provide: ADAPTIVE_RULES, useValue: rules }
      ]
    });

    const testBed = getTestBed();
    adaptiveService = testBed.get(AdaptiveService);
  };

  it(
    'should emit true when all conditions are true',
    async(() => {
      configureTestbed({
        maxScreenWidth: true,
        minScreenWidth: true,
        orientation: true,
        devices: true
      });

      adaptiveService
        .validate({
          maxScreenWidth: 1,
          minScreenWidth: 1,
          orientation: 'portrait',
          devices: ['tablet']
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when at least one of the conditions is false',
    async(() => {
      configureTestbed({
        maxScreenWidth: true,
        minScreenWidth: true,
        orientation: true,
        devices: false
      });

      adaptiveService
        .validate({
          maxScreenWidth: 1,
          minScreenWidth: 1,
          orientation: 'portrait',
          devices: ['tablet']
        })
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when an unspecified condition is false',
    async(() => {
      configureTestbed({
        maxScreenWidth: true,
        minScreenWidth: true,
        orientation: true,
        devices: false
      });

      adaptiveService
        .validate({
          maxScreenWidth: 1,
          minScreenWidth: 1,
          orientation: 'portrait'
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when a custom boolean is false',
    async(() => {
      configureTestbed({});

      adaptiveService
        .validate({
          custom: [false]
        })
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when a custom boolean is true',
    async(() => {
      configureTestbed({});

      adaptiveService
        .validate({
          custom: [true]
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when a custom function returns false',
    async(() => {
      configureTestbed({});

      adaptiveService
        .validate({
          custom: [() => false]
        })
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when a custom function returns true',
    async(() => {
      configureTestbed({});

      adaptiveService
        .validate({
          custom: [() => true]
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when a custom observable emits false',
    async(() => {
      configureTestbed({});

      adaptiveService
        .validate({
          custom: [Observable.of(false)]
        })
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when a custom observable emits true',
    async(() => {
      configureTestbed({});

      adaptiveService
        .validate({
          custom: [Observable.of(true)]
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when a custom promise resolves with false',
    async(() => {
      configureTestbed({});

      const promise = new Promise(resolve => {
        resolve(false);
      });

      adaptiveService
        .validate({
          custom: [promise]
        })
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when a custom promise resolves with true',
    async(() => {
      configureTestbed({});

      const promise = new Promise(resolve => {
        resolve(true);
      });

      adaptiveService
        .validate({
          custom: [promise]
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit true when all conditions, including custom ones, return true',
    async(() => {
      configureTestbed({
        maxScreenWidth: true,
        minScreenWidth: true,
        orientation: true,
        devices: true
      });

      const promise = new Promise(resolve => {
        resolve(true);
      });

      adaptiveService
        .validate({
          maxScreenWidth: 1,
          minScreenWidth: 1,
          orientation: 'portrait',
          devices: ['tablet'],
          custom: [promise, Observable.of(true), true, () => true]
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when only 1 custom condition is false, but everything else is true',
    async(() => {
      configureTestbed({
        maxScreenWidth: true,
        minScreenWidth: true,
        orientation: true,
        devices: true
      });

      // the custom promise is the only false value
      const promise = new Promise(resolve => {
        resolve(false);
      });

      adaptiveService
        .validate({
          maxScreenWidth: 1,
          minScreenWidth: 1,
          orientation: 'portrait',
          devices: ['tablet'],
          custom: [promise, Observable.of(true), true, () => true]
        })
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    "should emit false when a condition specified as a rule doesn't validate",
    async(() => {
      const rule: AdaptiveRule = {
        name: 'myScreenWidthRule',
        conditions: {
          minScreenWidth: 100
        }
      };

      configureTestbed(
        {
          maxScreenWidth: false,
          minScreenWidth: false,
          orientation: true,
          devices: true
        },
        [rule]
      );

      adaptiveService
        .validate({
          rule: rule.name
        })
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when a condition specified as a rule does validate',
    async(() => {
      const rule: AdaptiveRule = {
        name: 'myScreenWidthRule',
        conditions: {
          minScreenWidth: 100
        }
      };

      configureTestbed(
        {
          maxScreenWidth: false,
          minScreenWidth: true,
          orientation: true,
          devices: true
        },
        [rule]
      );

      adaptiveService
        .validate({
          rule: rule.name
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should wait if a rule is used that is not yet specified',
    async(() => {
      const rule: AdaptiveRule = {
        name: 'myScreenWidthRule',
        conditions: {
          minScreenWidth: 100
        }
      };

      configureTestbed({
        maxScreenWidth: false,
        minScreenWidth: true,
        orientation: true,
        devices: true
      });

      const start: number = new Date().getTime();

      adaptiveService
        .validate({
          rule: rule.name
        })
        .subscribe(result => {
          const end: number = new Date().getTime();
          const time: number = end - start;
          expect(time).toBeGreaterThanOrEqual(1000);
        });

      setTimeout(() => adaptiveService.addRule(rule), 1000);
    })
  );

  it(
    'should be able to add a new rule during runtime',
    async(() => {
      const rule: AdaptiveRule = {
        name: 'myScreenWidthRule',
        conditions: {
          minScreenWidth: 100
        }
      };

      configureTestbed({
        maxScreenWidth: false,
        minScreenWidth: true,
        orientation: true,
        devices: true
      });

      adaptiveService.addRule(rule);

      adaptiveService
        .validate({
          rule: rule.name
        })
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it('should not emit a value when the rule is not specified', done => {
    configureTestbed({
      maxScreenWidth: false,
      minScreenWidth: true,
      orientation: true,
      devices: true
    });

    adaptiveService
      .validate({
        rule: 'ruleThatDoesNotExist'
      })
      .subscribe(result => fail('Should not have emitted a value'));

    setTimeout(() => done(), 1000);
  });

  it('should not emit a value when the rule was removed before validating', done => {
    const rule: AdaptiveRule = {
      name: 'myScreenWidthRule',
      conditions: {
        minScreenWidth: 100
      }
    };

    configureTestbed(
      {
        maxScreenWidth: false,
        minScreenWidth: true,
        orientation: true,
        devices: true
      },
      [rule]
    );

    adaptiveService.removeRule(rule.name);

    adaptiveService
      .validate({
        rule: rule.name
      })
      .subscribe(result => fail('Should not have emitted a value'));

    setTimeout(() => done(), 1000);
  });
});
