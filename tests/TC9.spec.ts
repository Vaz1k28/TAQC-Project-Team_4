import { test, expect } from '@playwright/test';
import { allure } from '@playwright/allure-playwright';
import { CreateNewsPage } from '../pages/createNews.page';
import { BASE_URL } from '../components/base.component';

test.describe('GreenCity News Editing Permissions', () => {
    let createNewsPage: CreateNewsPage;

    test.beforeEach(async ({ page }) => {
        createNewsPage = new CreateNewsPage(page);
        await createNewsPage.openCreateNewsPage();
    });

    test('TC-08: Edit news button visibility for author validation', async ({ page }) => {
        allure.id('TC-08');
        allure.story('Відображення кнопки редагування для автора новини');
        allure.severity('normal');

        const editNewsButton = page.locator('button').filter({ hasText: /Edit news|Редагувати/i }).first();

        await allure.step('Створити новину для отримання унікального лінка (або перейти до існуючої новини автора)', async () => {
            await createNewsPage.fillTitle('Author News Test');
            await createNewsPage.fillMainText('Valid content for checking edit button visibility');
            await createNewsPage.clickPublish();
            await page.waitForLoadState('networkidle');
        });

        await allure.step('Перевірити наявність кнопки Edit news на сторінці створеної новини', async () => {
            await expect(editNewsButton).toBeVisible();
        });
    });
});