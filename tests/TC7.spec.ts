import { test, expect } from '@playwright/test';
import { allure } from '@playwright/allure-playwright';
import { CreateNewsPage } from '../pages/createNews.page';
import { BASE_URL } from '../components/base.component';

test.describe('GreenCity News Creation', () => {
    let createNewsPage: CreateNewsPage;

    test.beforeEach(async ({ page }) => {
        createNewsPage = new CreateNewsPage(page);
        await createNewsPage.openCreateNewsPage();
    });

    test('TC-07: Cancel news creation validation', async ({ page }) => {
        allure.id('TC-07');
        allure.story('Скасування створення новини');
        allure.severity('normal');

        const confirmationModal = page.locator('app-post-news-loader, mat-dialog-container, .modal-dialog').first();
        const modalText = confirmationModal.locator('p, h2, .warning-text');
        const confirmCancelButton = confirmationModal.locator('button').filter({ hasText: /Yes, cancel|Вийти/i }).first();
        const continueEditingButton = confirmationModal.locator('button').filter({ hasText: /Continue editing|Продовжити/i }).first();

        await allure.step('Заповнити обов’язкові поля форми', async () => {
            await createNewsPage.fillTitle('Test');
            await createNewsPage.fillMainText('Test content with 20 chars');
        });

        await allure.step('Натиснути кнопку Cancel', async () => {
            await createNewsPage.cancelButton.click();
        });

        await allure.step('Перевірити появу модального вікна підтвердження та його текст', async () => {
            await expect(confirmationModal).toBeVisible();
            await expect(modalText).toContainText('All created content will be lost. Do you still want to cancel news creating?');
        });

        await allure.step('Натиснути Continue editing та перевірити збереження даних', async () => {
            await continueEditingButton.click();
            await expect(confirmationModal).not.toBeVisible();
            await expect(createNewsPage.formContainer).toBeVisible();
            await createNewsPage.expectTitleValue('Test');
        });

        await allure.step('Повторно натиснути Cancel', async () => {
            await createNewsPage.cancelButton.click();
            await expect(confirmationModal).toBeVisible();
        });

        await allure.step('Натиснути Yes, cancel та перевірити редірект', async () => {
            await confirmCancelButton.click();
            await expect(createNewsPage.formContainer).not.toBeVisible();
            await expect(page).toHaveURL(`${BASE_URL}/greenCity/news`);
        });
    });
});