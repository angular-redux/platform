import { AppPage } from './app.po';

describe('Zoo Animals App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message saying "Welcome to the Zoo"', () => {
    page.navigateTo();
    const expectedZoo: any = 'Welcome to the Zoo';
    expect(page.getParagraphText()).toEqual(expectedZoo);
  });
});
