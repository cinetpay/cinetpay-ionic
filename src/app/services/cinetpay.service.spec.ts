import { TestBed } from '@angular/core/testing';

import { CinetpayService } from './cinetpay.service';

describe('CinetpayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CinetpayService = TestBed.get(CinetpayService);
    expect(service).toBeTruthy();
  });
});
