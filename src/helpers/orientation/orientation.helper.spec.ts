// import {
//   async,
//   ComponentFixture,
//   TestBed,
//   getTestBed
// } from '@angular/core/testing';
// import { Observable, BehaviorSubject } from 'rxjs/Rx';
//
// import {Orientation, OrientationHelper} from './orientation.helper';
// import {WindowRefHelper} from "../window-ref/window-ref";
// import {Injector} from "@angular/core";
// import {DeviceHelper} from "../device/device.helper";
// import {DEBOUNCE_TIME, USER_AGENT_STRING} from "../../services/adaptive/adaptive.service";
//
// const iphone: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A501';
//
// describe('OrientationHelper', () => {
//   let orientationHelper: OrientationHelper;
//
//   const configureTestbed = (orientation: Orientation) => {
//     const mockWindowRef: WindowRefHelper = {
//       nativeWindow: {
//         innerWidth,
//         onresize: () => {},
//         addListener: () => {},
//         removeListener: () => {}
//       }
//     };
//
//     class MockDeviceHelper {
//       public activeObservable = Observable.of('tablet');
//     }
//
//     TestBed.configureTestingModule({
//       providers: [
//         OrientationHelper,
//         Injector,
//         WindowRefHelper,
//         { provide: WindowRefHelper, useValue: mockWindowRef },
//         { provide: DEBOUNCE_TIME, useValue: 0 },
//         { provide: USER_AGENT_STRING, useValue: iphone },
//         { provide: DeviceHelper, useClass: DeviceHelper}
//       ]
//     });
//
//     const testBed = getTestBed();
//     orientationHelper = testBed.get(OrientationHelper);
//   };
//
//   it('should emit true when we test for portrait, and the user is in portrait', async(() => {
//     configureTestbed('portrait');
//
//     orientationHelper
//       .validate('portrait')
//       .subscribe((result) => expect(result).toBe(true));
//   }));
//
// });
