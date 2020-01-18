import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheetservice';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/player.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { findIndex, shuffle } from 'src/app/utils/array';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];
  @ViewChild(NzCarouselComponent, { static: true }) private naCarousel: NzCarouselComponent;
  carouseActiveIndex: number = 0;
  private playState: PlayState;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>
  ) {
    this.route.data.pipe(map(res => res.homeData)).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    });

    this.store$.pipe(select('player')).subscribe(res => this.playState = res)
  }

  ngOnInit() {
  }

  onBeforeChange({ to }) {
    this.carouseActiveIndex = to;
  }

  changeSlide(type: 'pre' | 'next') {
    this.naCarousel[type]();
  }

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({ songList: list }));

      let trueIndex = 0;
      let trueList = list.slice();

      console.log("this.playState.playMode.type:", this.playState.playMode.type);
      if (this.playState.playMode.type === 'random') {
        trueList = shuffle(list || []);
        trueIndex = findIndex(trueList, list[trueIndex]);
      }
      this.store$.dispatch(SetPlayList({ playList: trueList }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
      // console.log(list);
    });
  }
}
