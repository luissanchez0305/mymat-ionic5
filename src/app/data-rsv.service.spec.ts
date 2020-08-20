import { TestBed } from '@angular/core/testing';

import { DataRSVService } from './data-rsv.service';

describe('DataRSVService', () => {
  let service: DataRSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataRSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
