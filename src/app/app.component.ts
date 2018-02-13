import { Component } from '@angular/core';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

import * as jQuery from 'jquery';
import * as $ from 'jquery';
import * as NProgress from 'nprogress';
import { SuccessFailureModalComponent } from '../app/components/seller-page/success-failure-modal/success-failure-modal.component'
import { ModalHelperService } from '../app/services/modal-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  spinnerGifPath = `<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`;
  title = 'app';

  constructor(/* private idle: Idle, */ private modalService: ModalHelperService) {
    /* let countDown = 5;
    idle.setIdle(10000);
    idle.setTimeout(5);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); */
    // idle.onIdleEnd.subscribe(() => this.modalService.showTimeOut('No longer idle.'));
    /*  idle.onTimeout.subscribe(() => {
       // this.modalService.showTimeOut('Timed out!');
       // this.timedOut = true;
     }); */
    /* idle.onIdleStart.subscribe(() => {
      this.modalService.showTimeOut(countDown);
    });
    idle.onTimeoutWarning.subscribe((countdown) => countDown = countdown);
    idle.watch(); */
  }
}


