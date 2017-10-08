/**
 * Helper file for unit tests. We need to have a component to test our directives on.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({
  selector: 'test-component',
  template: `<span>PlaceHolder HTML to be Replaced</span>`
})
export class TestComponent {}

export const createTestComponent = (
  template: string
): ComponentFixture<TestComponent> => {
  return TestBed.overrideComponent(TestComponent, {
    set: { template }
  }).createComponent(TestComponent);
};
