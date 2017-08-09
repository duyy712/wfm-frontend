import { WamFrontendPage } from './app.po';

describe('wam-frontend App', () => {
  let page: WamFrontendPage;

  beforeEach(() => {
    page = new WamFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
