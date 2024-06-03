import { TestBed } from '@angular/core/testing';

import { DeskpositionsService } from './deskpositions.service';

describe('DeskpositionsService', () => {
  let service: DeskpositionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeskpositionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
