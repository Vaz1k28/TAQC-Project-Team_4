import { test } from '@playwright/test';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('GreenCity - Create News Form Validation', () => {

  test('TC-01: Verify that the Create News form displays all the necessary fields in the correct order', async ({ page }) => {
    const createNewsPage = new CreateNewsPage(page);

    await test.step('Precondition: Navigate to Home Page', async () => {
        await createNewsPage.openHomePage();
    });

    await test.step('Precondition: Change language and Login to account', async () => {
        await createNewsPage.languageChange();
        await createNewsPage.login();
    });

    await test.step('Navigate to the Create News page form directly', async () => {
        await createNewsPage.openCreateNewsPage();
    });

    await createNewsPage.verifyCreateNewsFormLayout();
    await createNewsPage.expectAuthorAndDateAreReadonly();
  });

});