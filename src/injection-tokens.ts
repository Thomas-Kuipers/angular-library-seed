import {ScreenWidthSpec} from "./helpers/screen-width/screen-width.helper";
import {InjectionToken} from "@angular/core";

export const USER_AGENT_STRING = new InjectionToken<string>('USER_AGENT_STRING');
export const DEBOUNCE_TIME = new InjectionToken<number>('DEBOUNCE_TIME');
export const SCREEN_WIDTH_BREAKPOINTS = new InjectionToken<ScreenWidthSpec[]>('SCREEN_WIDTH_BREAKPOINTS');
