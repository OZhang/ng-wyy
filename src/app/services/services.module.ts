import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    { provide: API_CONFIG, useValue: environment.apiUrl },
    {
      provide: WINDOW, useFactory(platformId: Object): Window | Object {
        return isPlatformBrowser(platformId ? window : {});
      }, deps: [PLATFORM_ID]
    },
  ]
})
export class ServicesModule { }
