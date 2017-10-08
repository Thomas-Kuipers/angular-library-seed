# `ngx-adaptive` - a module for adaptive and responsive Angular (>= 2) applications

[![codecov](https://codecov.io/gh/Thomas-Kuipers/ngx-adaptive/branch/master/graph/badge.svg)](https://codecov.io/gh/Thomas-Kuipers/ngx-adaptive)
[![build status](https://travis-ci.org/Thomas-Kuipers/ngx-adaptive.svg?branch=master)](https://travis-ci.org/Thomas-Kuipers/ngx-adaptive)

Example usage:
````
<component-for-large-screens *ifMinScreenWidth="'l'"></component-for-large-screens>
<component-for-small-screens *ifMaxScreenWidth="'s'"></component-for-small-screens>
````

Add the class 'bigButtons' when the user is on a mobile or tablet device, and
 add the class 'smallButtons' when the user is on desktop.
````
<nav 
  [adaptiveClasses]="{
      bigButtons: { devices: ['mobile', 'tablet'] },
      smallButtons: { devices: ['desktop'] }
  }">
</nav>
````

Example with all available conditions.
````
const myBooleanObservable = Observable.of(true);
const myBooleanPromise = new Promise(resolve => resolve(true));
const myBoolean = true;
const myBooleanFunction = () => true;

<component-with-many-conditions *ifAdaptive="{
    devices: ['desktop'],
    minScreenWidth: 100,
    maxScreenWidth: 'xl',
    orientation: 'landscape',
    browsers: ['Chrome', 'Firefox'],
    custom: [myBooleanObservable, myBooleanPromise, myBoolean, myBooleanFunction]
  }">
</component-with-many-conditions>
````

Specifying `AdaptiveRules`, which are sets of `AdaptiveConditions` that are resuable.
````
// app.module.ts
import { AdaptiveModule } from '../../lib/adaptive.module';

const myRule: AdaptiveRule = {
  name: 'smallPhones',
  conditions: {
    maxScreenWidth: 's',
    devices: ['mobile']
  }
};

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AdaptiveModule.forRoot({
      rules: [myRule]
    })
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

// app.component.html
<tiny-touchscreen-component *ifRule="'smallPhones'"></tiny-touchscreen-component>
````

Using the `AdaptiveService` in a service or component class.
````
@Injectable()
export class MyService {
  constructor(private adaptiveService: AdaptiveService) {}
  
  public areWeOnMobile() {
    const conditions: AdaptiveConditions = {
      devices: ['mobile']
    };
  
    this.adaptiveService.validate(conditions)
      .subscribe((result: boolean) => {
        if (result) {
          console.log('We are on mobile');
        } else {
          console.log('We are not on mobile');
        }
      });
  }
}
````
