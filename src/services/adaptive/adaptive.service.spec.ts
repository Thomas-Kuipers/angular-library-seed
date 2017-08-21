import { AdaptiveService } from './adaptive.service';

describe('AdaptiveService', () => {
  let adaptiveService: AdaptiveService;

  beforeEach(() => {
    adaptiveService = new AdaptiveService;
  });

  it('shouldnt be a dick', () => {
    expect(adaptiveService.imADick()).toBeTruthy();
  })
});
