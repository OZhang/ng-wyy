import { NgModule, SkipSelf, Optional } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module';
import { ShareModule } from '../share/share.module';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
import { PagesModule } from '../pages/pages.module';

registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    ShareModule,
    AppRoutingModule,
  ],
  exports: [
    ShareModule,
    AppRoutingModule,
  ]
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule){
    if (parentModule) {
      throw new Error('CoreModule could only be imported by appModule')
    }
  }
 }
