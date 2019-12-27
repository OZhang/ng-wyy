import { NgModule, InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    {provide: API_CONFIG, useValue: environment.apiUrl},
  ]
})
export class ServicesModule { }
