import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singerservice';

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
  @ViewChild(NzCarouselComponent, {static: true}) private naCarousel: NzCarouselComponent;
  carouseActiveIndex: number = 0;
  constructor(private homeService: HomeService, private singerService: SingerService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSheetList();
    this.getEnterSingers();
   }

  ngOnInit() {
  }

  private getBanners(){
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    })
  }

  private getHotTags(){
    this.homeService.getHotTags().subscribe(tags => {
      this.hotTags = tags;
    })
  }

  private getPersonalizedSheetList(){
    this.homeService.getPersonalSheetList().subscribe(sheets => {
      this.songSheetList = sheets;
    })
  }
  onBeforeChange({to}){
    this.carouseActiveIndex = to;
  }

  changeSlide(type: 'pre' | 'next'){
    this.naCarousel[type]();
  }

  getEnterSingers() {
    this.singerService.getEnterSinger().subscribe(singers=> {
      this.singers = singers;
    })
  }

}
