import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SellerInfoManagerService } from '../../../services/seller-info-manager.service';
import { ProfileProgressModel } from '../../../models/profile-progress.model';
import { CookieService } from 'ngx-cookie-service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { SharedService } from '../../../services/shared.service';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-profile-progress',
  templateUrl: './profile-progress.component.html',
  styleUrls: ['./profile-progress.component.css']
})
export class ProfileProgressComponent implements OnInit {

  profileProgress: ProfileProgressModel;
  email = 'raju@i4g.com';
  companyID = 41;
  loading: boolean;

  constructor(public sellerInfoManager: SellerInfoManagerService, private activatedRoute: ActivatedRoute, private cookies: CookieService,
    private modalService: ModalHelperService, private sharedService: SharedService, private router: Router) {
    /* this.loadProfileProgressPercentage(); */
  }

  ngOnInit() {
    /*     this.activatedRoute.queryParams.filter(params => params.email).subscribe((params: Params) => {
          this.email = params.email || this.email;
          this.companyID = params.companyId || this.companyID;
          console.log(this.email + ',' + this.companyID);
        });
        setTimeout(() => {
          this.loadProfileProgressPercentage();
        }, 80); */
    this.email = this.cookies.get('i4g_auth_email');
    this.loadProfileProgressPercentage();
  }

  loadProfileProgressPercentage = () => {
    if (!this.email) {
      this.modalService.showFailure('Error', 'Couldn\'t identify the user, please try loggin in again');
      return;
    }
    this.loading = true;
    this.sellerInfoManager.getCompanyVerificationProgress({ Email: this.email }).subscribe((response) => {
      this.sellerInfoManager.sellerInformation.profileProgressPercentage = parseInt(response.message, 10)
        ? parseInt(response.message, 10) : 0;
      console.log(this.sellerInfoManager.sellerInformation.profileProgressPercentage);
      this.loading = false;
      // Below is a hack as [attr.data-percentage]= value doesn't work on the html.
      // This needs to be removed once a proper angular alternative is found for the easy-pie-chart.
      jQuery('.chart').data('easyPieChart').update(this.sellerInfoManager.sellerInformation.profileProgressPercentage);
    }, (error) => {
      this.loading = false;
      this.sellerInfoManager.sellerInformation.profileProgressPercentage = 0;
    });
  }

  getProfileProgress = (): void => {
    if (!this.profileProgress) {
      this.loading = true;
      this.sellerInfoManager.getCompanyProfileProgress({ Email: this.email }).subscribe((response) => {
        this.sellerInfoManager.sellerInformation.profileProgress = this.profileProgress = response;
        console.log(this.sellerInfoManager.sellerInformation.profileProgress);
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.sellerInfoManager.sellerInformation.profileProgress = null;
      });
    }
  }

  applyClasses = (elementName: string, complete: boolean): any => {
    let classes;
    if (elementName === 'icon') {
      classes = {
        'fa-check-circle': complete,
        'text-success': complete,
        'fa-exclamation-circle': !complete,
        'text-danger': !complete,
      };
    }
    if (elementName === 'anchor') {
      classes = {
        'remove-pointer': complete,
        'quitter': !complete
      };
    }
    return classes;
  }

  handleClick = (complete: boolean, sectionName: string, event: Event): void => {
    if (complete) {
      event.preventDefault();
    } else {
      if (sectionName === 'my-package') {
        this.router.navigateByUrl('/my-package');
      }
      this.sharedService.pushSelection(sectionName);
    }
  }

}
