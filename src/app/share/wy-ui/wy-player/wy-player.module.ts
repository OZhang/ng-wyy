import { NgModule } from '@angular/core';
import { WyPlayerComponent } from './wy-player.component';
import { CommonModule } from '@angular/common';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    CommonModule,
    FormsModule,
    WySliderModule,
  ],
  exports:[
    WyPlayerComponent,
  ]
})
export class WyPlayerModule { }
