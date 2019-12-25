import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[];
  @ViewChild(NzCarouselComponent, {static: true}) private naCarousel: NzCarouselComponent;
  carouseActiveIndex: number = 0;
  constructor(private homeService: HomeService) {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
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
