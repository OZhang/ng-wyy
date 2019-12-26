import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../play-count.pipe';



@NgModule({
  declarations: [
    PlayCountPipe,
    SingleSheetComponent, 
  ],
  imports: [
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
  ]
})
export class WyUiModule { }
