import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  scrollY = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      console.log("songList: ", this.songList);
    }
    if (changes['currentSong']) {
      console.log("currentSong: ", this.currentSong);
      if (this.currentSong) {
        if (this.show) {
          this.scrollToCurrent();
        }
      }
    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        setTimeout(() => {
          if (this.currentSong) {
            this.scrollToCurrent();
          }
        }, 80);
      }
      console.log("currentSong: ", this.currentSong);
    }
  }
  private scrollToCurrent() {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      // console.log('scrollY: ', this.scrollY);
      // console.log('offsetTop: ', offsetTop);

      console.log('(offsetTop - Math.abs(this.scrollY): ', (offsetTop - Math.abs(this.scrollY)));
      console.log('offsetHeight * 5: ', offsetHeight * 5);


      if ((offsetTop - Math.abs(this.scrollY) >= offsetHeight * 4.8) ||
        (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, 300, false, false);
      }
    }
  }
}
