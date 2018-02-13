import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { HttpHelperService } from '../../../services/http-helper.service';
import { ActivatedRoute, Params } from '@angular/router';

import { SellerInfoManagerService } from '../../../services/seller-info-manager.service';
import { IndustryCode } from '../../../models/industry-code.model';
import { SellerSectorListResponse, SellerIndustriesListResponse } from '../../../models/response-types.model';
import { SectorCode } from '../../../models/sector-code.model';
import { CookieService } from 'ngx-cookie-service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-business-types',
  templateUrl: './business-types.component.html',
  styleUrls: ['./business-types.component.css']
})
export class BusinessTypesComponent implements OnInit {

  sellerSectorListResponse: any;
  sellerIndustriesResponse: any;
  sellerSectorArray: SectorCode[];
  sellerIndustriesBySector: IndustryCode[];
  sellerIndustriesArray: IndustryCode[];
  selectedIndustriesArray = [];
  selectedIndustry;
  userSelectedIndustry = false;
  markAllOrOnlySelected = false;
  email = 'raju@i4g.com';
  companyID = 41;
  loading: boolean;
  panelCollapsed = true;
  @ViewChild('panelHeader') panelHeader: ElementRef;

  constructor(private httpHelper: HttpHelperService, private activatedRoute: ActivatedRoute,
    private sellerInfoMngr: SellerInfoManagerService, private cookies: CookieService,
    private modalService: ModalHelperService, private sharedService: SharedService) { }

  ngOnInit() {
    /* const parameters = this.activatedRoute.queryParams.filter(params => params.email || params.companyId).subscribe((params) => {
      this.email = params.email || this.email;
      this.companyID = params.companyId || this.companyID;
    }); */
    this.email = this.cookies.get('i4g_auth_email');
    this.sharedService.selectedSection$.subscribe((sectionName: string) => {
      if ((sectionName === 'business-types' && this.panelCollapsed)
        || (sectionName !== 'business-types' && sectionName !== 'default message' && !this.panelCollapsed)) {
        this.panelHeader.nativeElement.click();
      }
    });
  }

  loadData = (): void => {
    this.panelCollapsed = !this.panelCollapsed;
    if (!this.email) {
      this.modalService.showFailure('Error', 'Couldn\'t identify the user, please try loggin in again');
      return;
    }

    const sellerSectorUrl = '/getSectors';
    const sectorListData = { Email: this.email };

    if (!this.sellerInfoMngr.sellerInformation.selectedIndustriesList) {
      this.sellerInfoMngr.sellerInformation.selectedIndustriesList = [];
    }
    this.loading = true;
    this.httpHelper.getData<SellerSectorListResponse>(sellerSectorUrl).subscribe(
      (sellerSectorList) => {
        this.sellerSectorListResponse = sellerSectorList,
          this.sellerSectorArray = this.sellerSectorListResponse.SectorCodes.SectorCode;
        // console.log('seller sector Array', this.sellerSectorArray);
        this.sellerSectorArray ? this.loadIndustriesForSelectedSector(null, null, null) : null;
        // console.log('sectors list', this.sellerSectorArray);
        this.loading = false;
      },
      (error) => {
        console.log('Error = ', error);
        this.loading = false;
      }
    );
  }

  loadIndustriesForSelectedSector(event, sectorCode, sectorName) {

    let sectorCodeInput;
    let loadIndustryListFromService = false;
    if (!event && this.sellerSectorArray && this.sellerSectorArray.length > 0) {
      sectorCodeInput = this.sellerSectorArray[0].Code;
      loadIndustryListFromService = true;
    } else if (event && sectorCode) {
      sectorCodeInput = sectorCode;
      loadIndustryListFromService = false;
    }

    const cachedIndustryList = sessionStorage.getItem(sectorCodeInput);
    if (cachedIndustryList && !loadIndustryListFromService) {
      this.sellerIndustriesBySector = JSON.parse(cachedIndustryList);
      this.updateIndustriesSelection(null, null, null, false);
    } else {
      const industriesListData = { Email: this.email, SectorCode: sectorCodeInput };
      const sellerIndustriesUrl = '/getSellerIndustries';
      this.loading = true;
      this.httpHelper.postData<SellerIndustriesListResponse>(sellerIndustriesUrl, industriesListData).subscribe(
        (sellerIndustriesList) => {
          this.loading = false;
          this.sellerIndustriesResponse = sellerIndustriesList,
            this.sellerIndustriesArray = this.sellerIndustriesResponse.SelectedSellerIndustries.IndustryCodes.IndustryCode;
          this.sellerIndustriesBySector = this.sellerIndustriesResponse.SellerIndustriesBySector.IndustryCodes.IndustryCode;
          this.markSelectedIndustries(false, null, true);
          sessionStorage.setItem(this.sellerIndustriesBySector[0].SectorCode.toString(), JSON.stringify(this.sellerIndustriesBySector));
        },
        (error) => {
          this.loading = false;
          console.log('Error = ', error);
        }
      );
    }
  }

  markSelectedIndustries(isUserSelectedIndustry: boolean, userSelectedIndustryCode: number, markUnmarkIndustry: boolean) {
    let indCode;
    if (this.sellerIndustriesArray && this.sellerIndustriesArray.length) {
      for (let i = 0; i < this.sellerIndustriesArray.length; i++) {
        let index;
        if (isUserSelectedIndustry) {
          index = this.sellerIndustriesBySector.findIndex(x => x.IndustryCode === userSelectedIndustryCode);
        } else {
          index = this.sellerIndustriesBySector.findIndex(x => x.IndustryCode === this.sellerIndustriesArray[i].IndustryCode);
        }
        const sellerIndustryToMarkSelected = this.sellerIndustriesBySector[index];
        sellerIndustryToMarkSelected ? sellerIndustryToMarkSelected.Selected = markUnmarkIndustry : null;
        sellerIndustryToMarkSelected ? this.sellerIndustriesBySector[index] = sellerIndustryToMarkSelected : null;
        sellerIndustryToMarkSelected ? indCode = this.sellerIndustriesBySector[index].IndustryCode : null;
      }
      this.updateIndustriesSelection(null, indCode, isUserSelectedIndustry, markUnmarkIndustry);
    }
  }

  updateIndustriesSelection(event, industryCode, markSelectedOnly, flag) {
    // console.log('checkbox value ', event ? event.target.checked : null);
    if (!event && flag && this.sellerIndustriesBySector && this.sellerIndustriesBySector.length > 0) {
      this.userSelectedIndustry = false;
      const filteredIndustriesList = this.sellerIndustriesBySector.filter(x => x.Selected === true);
      if (!markSelectedOnly) {
        filteredIndustriesList.forEach(obj => {
          this.selectedIndustriesArray.push({ SectorCode: obj.SectorCode, IndustryCode: obj.IndustryCode });
        });
      } else {
        this.selectedIndustriesArray.push({ SectorCode: 11, IndustryCode: industryCode });
      }

    } else if (event) {
      this.userSelectedIndustry = true;
      this.markSelectedIndustries(this.userSelectedIndustry, industryCode, event.target.checked);
      if (sessionStorage.getItem(this.sellerIndustriesBySector[0].SectorCode.toString())) {
        sessionStorage.removeItem(this.sellerIndustriesBySector[0].SectorCode.toString());
        sessionStorage.setItem(this.sellerIndustriesBySector[0].SectorCode.toString(), JSON.stringify(this.sellerIndustriesBySector));
      }
    } else {
      this.selectedIndustriesArray = this.selectedIndustriesArray.filter(x => x.IndustryCode !== industryCode);
    }
    this.sellerInfoMngr.sellerInformation.selectedIndustriesList = this.selectedIndustriesArray;
  }

  updateBusinessTypes() {
    const url = '/updateSellerIndustries';

    const industryCodeData = {
      IndustryCode: this.selectedIndustriesArray
    };
    const industryCodesData = {
      IndustryCodes: industryCodeData
    };
    const sellerIndustriesUpdateData = {
      CompanyID: 41, SellerIndustries: industryCodesData
    };
    this.loading = true;
    this.httpHelper.postData(url, sellerIndustriesUpdateData).subscribe(
      (responseData: Response) => {
        console.log('response = ', responseData);
        this.selectedIndustriesArray = [];
        this.loading = false;
        this.panelHeader.nativeElement.click();
        this.panelCollapsed = !this.panelCollapsed;
      },
      (error) => {
        console.log('error = ', error);
        this.loading = false;
      }
    );
  }

  cancel = (): void => {
    this.panelHeader.nativeElement.click();
  }
}
