import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SuccessFailureModalComponent } from './../components/seller-page/success-failure-modal/success-failure-modal.component';
import { IdleTimeOutModalComponent } from '../components/idle-time-out-modal/idle-time-out-modal.component';

@Injectable()
export class ModalHelperService {
    constructor(private modalService: BsModalService) {
    }

    showSuccess(successTitle?: string, successMessage?: string) {
        const bsModalRef = this.modalService.show(SuccessFailureModalComponent, Object.assign({}, {}, { class: 'modal-sm' }));
        bsModalRef.content.title = successTitle;
        bsModalRef.content.message = successMessage;
    }

    showFailure(failureTitle?: string, failureMessage?: string) {
        const bsModalRef = this.modalService.show(SuccessFailureModalComponent, Object.assign({}, {}, { class: 'modal-sm' }));
        bsModalRef.content.title = failureTitle;
        bsModalRef.content.message = failureMessage;
    }

    showTimeOut = (timeoutValue: number) => {
        const config = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true
        };
        const bsModalRef = this.modalService.show(IdleTimeOutModalComponent, Object.assign({}, config, { class: 'modal-sm' }));
        bsModalRef.content.timeoutValue = timeoutValue;
    }
}
