import { NgModule } from '@angular/core';
import { WyPlayerComponent } from './wy-player.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    CommonModule,
  ],
  exports:[
    WyPlayerComponent,
  ]
})
export class WyPlayerModule { }
