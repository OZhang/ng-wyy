import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '../../../store/index';
import { getSongList, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from '../../../store/selectors/player.selector';
import { Song } from '../../../services/data-types/common.types';
import { PlayMode } from './player-type';
import { SetCurrentIndex, SetPlayMode, SetPlayList, SetSongList } from 'src/app/store/actions/player.action';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle, findIndex } from 'src/app/utils/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { NzModalService } from 'ng-zorro-antd';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环',
  }, {
    type: 'random',
    label: '随机'
  }, {
    type: 'singleLoop',
    label: '单曲循环'
  },
];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  @ViewChild('audio', { static: true }) private audio: ElementRef;
  @ViewChild(WyPlayerPanelComponent, { static: false }) private playerPanel: WyPlayerPanelComponent;
  private audioEl: HTMLAudioElement;
  percent = 0;
  bufferPercent = 0;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;
  currentTime: number;

  playing = false;
  songReady = false;

  volume = 60;
  showVolumePanel: boolean = false;
  showPanel: boolean = false;
  bindFlag = false;
  private winClick: Subscription;

  currentMode: PlayMode;
  modeCount: number = 0;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalServe: NzModalService,
    private batchActionsService: BatchActionsService
  ) {
    const appStore$ = this.store$.pipe(select('player'));
    const stateArr = [
      {
        type: getSongList,
        cb: list => this.watchList(list, 'songList')
      },
      {
        type: getPlayList,
        cb: list => this.watchList(list, 'playList')
      }, {
        type: getCurrentIndex,
        cb: index => this.watchCurrentIndex(index)
      }, {
        type: getPlayMode,
        cb: mode => this.watchPlayMode(mode)
      }, {
        type: getCurrentSong,
        cb: song => this.watchCurrentSong(song)
      }];

    stateArr.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    })
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log('mode :', mode);
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        console.log("mode.type === 'random'");
        list = shuffle(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({ playList: list }));
      } else if (mode.type === 'loop') {
        console.log("mode.type === 'loop'");
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({ playList: this.songList }));
      } else if (mode.type === 'singleLoop') {
        console.log("mode.type === 'singleLoop'");
        this.store$.dispatch(SetPlayList({ playList: [this.currentSong] }));
        this.updateCurrentIndex(list, this.currentSong);
      }
    }
  }
  updateCurrentIndex(list: Song[], currentSong: Song) {
    // const newIndex = list.findIndex(item => item.id === currentSong.id);
    const newIndex = findIndex(list, currentSong);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
      console.log('song :', this.currentSong);
    }
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  private play() {
    this.playing = true;
    this.audioEl.play();
  }
  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffer = this.audioEl.buffered;
    if (buffer.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffer.end(0) / this.duration) * 100;
    }
  }
  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : "//s4.music.126.net/style/web2/img/default/default_album.jpg";
  }

  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    }
    else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  onPrev(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  onNext(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }
  loop() {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
    this.bufferPercent = 0;
  }

  onPercentChange(per: number) {
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (per / 100);
      if (this.playerPanel) {
        this.playerPanel.seekLyric(this.audioEl.currentTime * 1000);
      }
    }
  }

  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }
  toggleVolPanel() {
    this.togglePanel("showVolumePanel");
  }
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel("showPanel");
    }
  }

  togglePanel(type: string) {
    this[type] = !this[type];
    this.bindFlag = this.showVolumePanel || this.showPanel
  }

  onClickOutside() {
    console.log("onClickOutside()");
    this.showVolumePanel = false;
    this.showPanel = false;
    this.bindFlag = false;
  }

  changeMode() {
    this.store$.dispatch(SetPlayMode({ playMode: modeTypes[++this.modeCount % 3] }));
  }

  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    }
    this.onNext(this.currentIndex + 1);
  }


  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

  onDeleteSong(song: Song) {
    this.batchActionsService.deleteSong(song);
  }

  onClearSong() {
    this.nzModalServe.confirm({
      nzTitle: '确认清空列表',
      nzOnOk: () => {
        this.batchActionsService.clearSong();
      }
    });
  }

}