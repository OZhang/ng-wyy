import { Directive, ElementRef, Renderer2, Inject, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ɵELEMENT_PROBE_PROVIDERS__POST_R3__ } from '@angular/platform-browser';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges {

  private handleClick: () => void;
  @Input() bindFlag = false;
  @Output() onClickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef, private rd: Renderer2, @Inject(DOCUMENT) private doc: Document) {  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bindFlag'] && !changes['bindFlag'].firstChange) {
      if (this.bindFlag) {
        console.log('doc click');
        this.handleClick = this.rd.listen(this.doc, 'click', evt => {
          const isContain = this.el.nativeElement.contains(evt.target);
          if (!isContain) {
            this.onClickOutside.emit();
          }
        });
      } else {
        this.handleClick();
      }
    }
  } 

}
