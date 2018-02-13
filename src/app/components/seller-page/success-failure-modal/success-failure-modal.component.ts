import { Component, OnInit, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'i4g-success-failure-modal',
  templateUrl: './success-failure-modal.component.html',
  providers: [BsModalService]
})

export class SuccessFailureModalComponent implements OnInit {
  title: string;
  message: string;
  constructor(public bsModalRef: BsModalRef) { }
  ngOnInit() {
  }

  hide = (event: Event) => {
    event.preventDefault();
    this.bsModalRef.hide();
  }
}
