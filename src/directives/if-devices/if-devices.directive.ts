import {Directive, Input, SimpleChanges, TemplateRef, ViewContainerRef} from '@angular/core';
import {AdaptiveConditions, AdaptiveService} from '../../services/adaptive/adaptive.service';
import {IfBaseDirective, IfInterface} from '../if-base/';
import {Device} from '../../helpers/device/device.helper';

@Directive({
  selector: '[ifDevices]'
})
export class IfDevicesDirective extends IfBaseDirective implements IfInterface {
  @Input('ifDevices') public ifDevices: [Device];

  public conditions: AdaptiveConditions;

  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    adaptiveService: AdaptiveService
  ) {
    super(templateRef, viewContainer, adaptiveService);
  }

  public ngOnInit() {
    this.init({devices: this.ifDevices});
  }

  public ngOnDestroy() {
    this.destroy();
  }

  public ngOnChanges(changes: SimpleChanges) {

  }
}
