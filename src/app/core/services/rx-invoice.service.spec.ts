import { TestBed } from '@angular/core/testing';

import { RxInvoiceService } from './rx-invoice.service';

describe('RxInvoiceService', () => {
  let service: RxInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
