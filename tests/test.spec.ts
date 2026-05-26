import { test } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { CreateNewsPage } from '../pages/checkCreateNews';

test('TC-01: Check сreate news page elements', async ({ page }) => {

const basePage = new BasePage(page);
await basePage.openHomePage();
await basePage.languageChange();
await basePage.login();
await basePage.openCreateNewsPage();

const createNewsPage = new CreateNewsPage(page);
await createNewsPage.checkElementsVisibility();

});
     

