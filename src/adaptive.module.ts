import { NgModule } from '@angular/core';
import { AdaptiveService } from './services';
import { AdaptiveClassesDirective } from "./directives/adaptive-classes/adaptive-classes.directive";
import { AdaptiveIfDirective } from "./directives/adaptive-if/adaptive-if.directive";

@NgModule({
  providers: [
    AdaptiveService,
  ],
  declarations: [
    AdaptiveClassesDirective,
    AdaptiveIfDirective
  ],
  exports: [
    AdaptiveClassesDirective,
    AdaptiveIfDirective
  ]
})
export class AdaptiveModule {
}
