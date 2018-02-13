import { Directive, ElementRef, Input, EventEmitter, HostListener, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { ValidationService } from '../services/validation.service';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnChanges {

  @Input() title: string;


  constructor(private elRef: ElementRef) { }

  ngOnChanges() {
    if (this.title) {
      // ($('[data-toggle="tooltip"]') as any).tooltip('show');
      this.elRef.nativeElement.tooltip('show');
    }
  }

 /*  @HostListener('mouseleave') onmouseleave() {
    this.elRef.nativeElement.tooltip('hide');
    // ($('[data-toggle="tooltip"]') as any).tooltip('hide');
  } */

}
