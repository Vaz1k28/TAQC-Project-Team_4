import { test } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('TC-01: "Create News" form', () => {

  test.beforeEach(async ({ page }) => {
    const basePage = new BasePage(page);
    
    await basePage.openHomePage();
    await basePage.languageChange();
    await basePage.login();
    await basePage.openCreateNewsPage();
  });

  test('Verification of field presence, correct order, and their attributes ', async ({ page }) => {

    const createNewsPage = new CreateNewsPage(page);

    await createNewsPage.verifyFormLoaded();
    await createNewsPage.verifyFieldsLayoutOrder();
    await createNewsPage.interactWithTags();
    await createNewsPage.verifyFormFieldsAttributes();
    await createNewsPage.verifyControlButtons();
  });
});