import { NgModule, InjectionToken } from '@angular/core';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    {provide: API_CONFIG, useValue: 'http://192.168.1.15:3000/'},
  ]
})
export class ServicesModule { }
