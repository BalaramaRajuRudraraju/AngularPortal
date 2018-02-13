import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-idle-time-out-modal',
  templateUrl: './idle-time-out-modal.component.html',
  styleUrls: ['./idle-time-out-modal.component.css']
})
export class IdleTimeOutModalComponent implements OnInit {

  timeoutValue: string;
  constructor(public bsModalRef: BsModalRef) { }
  ngOnInit() {
  }

  hide = (event: Event) => {
    event.preventDefault();
    this.bsModalRef.hide();
  }
  logOff = () => {

  }

  stay = () => {

  }

}
