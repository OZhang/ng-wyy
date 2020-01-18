import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, ElementRef, Inject } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/songservice';
import { WyLyric, BaseLyricLine } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;
  @Input() playing: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  scrollY = 0;
  currentLyric: BaseLyricLine[];
  private lyric: WyLyric;
  currentLineNum: number;
  private lyricRefs: NodeList;


  constructor(
    // @Inject(WINDOW) private win: Window,
    private songService: SongService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }
    if (changes['songList']) {
      // console.log("songList: ", this.songList);
      this.currentIndex = findIndex(this.songList, this.currentSong);
    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {
        this.resetLyric();
      }
    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        })
      }
    }
  }

  private updateLyric() {
    this.resetLyric();
    this.songService.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      const startLine = res.tlyric ? 1 : 2;
      this.handleLyric(startLine);
      this.wyScroll.last.scrollTo(0, 0);
      if (this.playing) {
        this.lyric.play();
      }
    });
  }
  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }

  seekLyric(time: number){
    if (this.lyric){
      this.lyric.seek(time);
    }
  }

  private handleLyric(startLine = 2) {
    this.lyric.handler.subscribe(({ lineNum }) => {
      // console.log("lineNum", lineNum);
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
        console.log('this.lyricRefs', this.lyricRefs);
      }

      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        // const startScrollLine = 2;
        if (lineNum > startLine) {
          const targetLine = this.lyricRefs[lineNum - startLine];
          if (targetLine) {
            this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
          } else {
            this.wyScroll.last.scrollTo(0, 0);
          }
        }
      }

      // this.currentLineNum = lineNum;
      // console.log('lyric: ', this.currentLyric[lineNum]);
    })
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;

      console.log('(offsetTop - Math.abs(this.scrollY): ', (offsetTop - Math.abs(this.scrollY)));
      console.log('offsetHeight * 5: ', offsetHeight * 5);


      if ((offsetTop - Math.abs(this.scrollY) >= offsetHeight * 4.8) ||
        (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }
}
