import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singerservice';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

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

  constructor(private homeService: HomeService, private singerService: SingerService, private route: ActivatedRoute) {
    this.route.data.pipe(map(res => res.homeData)).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    })
   }

  ngOnInit() {
  }

  onBeforeChange({to}){
    this.carouseActiveIndex = to;
  }

  changeSlide(type: 'pre' | 'next'){
    this.naCarousel[type]();
  }


}
