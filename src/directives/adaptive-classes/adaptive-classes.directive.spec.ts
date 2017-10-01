import {
  async,
  TestBed,
  getTestBed, tick, fakeAsync
} from '@angular/core/testing';

import {AdaptiveService} from "../../services/adaptive/adaptive.service";
import {Observable} from "rxjs/Observable";
import {AdaptiveClassesDirective} from "./adaptive-classes.directive";
import {createTestComponent, TestComponent} from "../create-test-component";

describe('AdaptiveClassesDirective', () => {
  const configureTestbed = (result: boolean) => {
    class MockAdaptiveService {
      validate() {
        return Observable.of(result);
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

  it('should compile with adaptiveClassesDirective', async(() => {
    configureTestbed(true);

    const fixture = createTestComponent('<div></div>');

    expect(fixture).toBeDefined();
  }));

  it('should add a class when the conditions validate as true', fakeAsync(() => {
    configureTestbed(true);

    const fixture = createTestComponent('<div [adaptiveClasses]="{yolo: {minScreenWidth: 1}}">wat</div>');
    tick();
    const div = fixture.nativeElement.querySelector('div');

    console.log(div);

    // console.log(div.classList.contains('yolo'));

  }));
});
