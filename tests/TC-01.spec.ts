import { test } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('"Create News" Form', () => {

  test.beforeEach(async ({ page }) => {
    const basePage = new BasePage(page);
    
    await test.step('Prerequisites: User authorization and navigation to Create News page', async () => {
      await basePage.openHomePage();
      await basePage.languageChange();
      await basePage.login();
      await basePage.openCreateNewsPage();
    });
  });

  test('TC-01: Verification of field presence, correct order, and their attributes @smoke @regress', async ({ page }, testInfo) => {
    
    testInfo.annotations.push({
      type: 'description',
      description: 'Comprehensive UI/UX test for the Create News form. It verifies the successful loading of page components, validates the correct vertical sequence of fields from top to bottom using Y-coordinates, checks tag interaction logic, ensures the presence of mandatory placeholders, and verifies the initial state of control buttons.',
    });

    const createNewsPage = new CreateNewsPage(page);

    await test.step('Step 1: Verify form elements loading and visibility', async () => {
      await createNewsPage.verifyFormLoaded();
    });

    await test.step('Step 2: Verify fields vertical layout sequence (Layout Order)', async () => {
      await createNewsPage.verifyFieldsLayoutOrder();
    });

    await test.step('Step 3: Verify interaction with the tags block', async () => {
      await createNewsPage.interactWithTags();
    });

    await test.step('Step 4: Verify system labels, placeholders, and field attributes', async () => {
      await createNewsPage.verifyFormFieldsAttributes();
    });

    await test.step('Step 5: Verify the state of control buttons (Cancel, Preview, Publish)', async () => {
      await createNewsPage.verifyControlButtons();
    });
  });
});