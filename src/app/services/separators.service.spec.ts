import { TestBed } from '@angular/core/testing';

import { SeparatorsService } from './separators.service';

describe('SeparatorsService', () => {
  let service: SeparatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeparatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
