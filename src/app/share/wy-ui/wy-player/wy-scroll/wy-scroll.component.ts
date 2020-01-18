import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import { timer } from 'rxjs';
BScroll.use(MouseWheel);
BScroll.use(ScrollBar)

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width:100%; height:100%; overflow: hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() refreshDelay = 50;
  @Input() data: any[];
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  private bs: BScroll;
  @Output() private onScrollEnd = new EventEmitter<number>();
  constructor(readonly el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log('offsetHeight: ', this.wrapRef.nativeElement.offsetHeight);
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true
      },
      mouseWheel: {}
    });

    this.bs.on('scrollEnd', ({ y }) => {
      this.onScrollEnd.emit(y)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refreshScroll();
    }
  }

  private refresh() {
    console.log('refresh()')
    this.bs.refresh();
  }

  refreshScroll() {
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    });
    // setTimeout(() => {
    //   this.refresh();
    // }, this.refreshDelay)
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  scrollTo(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }
}
