import { TestBed, inject } from '@angular/core/testing';

import { SellerInfoManagerService } from './seller-info-manager.service';

describe('SellerInfoManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerInfoManagerService]
    });
  });

  it('should be created', inject([SellerInfoManagerService], (service: SellerInfoManagerService) => {
    expect(service).toBeTruthy();
  }));
});
