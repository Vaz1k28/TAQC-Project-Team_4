import { test, expect } from '@playwright/test';
import { allure } from '@playwright/allure-playwright';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('GreenCity News Creation', () => {
    let createNewsPage: CreateNewsPage;

    test.beforeEach(async ({ page }) => {
        createNewsPage = new CreateNewsPage(page);
        await createNewsPage.openCreateNewsPage();
    });

    test('TC-06: Preview news content validation', async ({ page }) => {
        allure.id('TC-06');
        allure.story('Попередній перегляд новини');
        allure.severity('normal');

        const previewContainer = page.locator('app-preview-news, .preview-container').first();
        const previewTitle = previewContainer.locator('h1, .news-title');
        const previewText = previewContainer.locator('.news-text, .ql-editor-preview');
        const previewAuthor = previewContainer.locator('.news-author, .author');
        const previewDate = previewContainer.locator('.news-date, .date');
        const backToEditingButton = previewContainer.locator('button').filter({ hasText: /Back to editing|Назад/i }).first();

        await allure.step('Заповнити поля форми валідними даними', async () => {
            await createNewsPage.fillTitle('Test Preview');
            await createNewsPage.fillMainText('This is a test preview content');
        });

        await allure.step('Натиснути кнопку Preview', async () => {
            await createNewsPage.previewButton.click();
        });

        await allure.step('Перевірити відображення введених даних у режимі попереднього перегляду', async () => {
            await expect(previewContainer).toBeVisible();
            await expect(previewTitle).toHaveText('Test Preview');
            await expect(previewText).toContainText('This is a test preview content');
        });

        await allure.step('Перевірити відображення автора, дати та кнопки повернення', async () => {
            await expect(previewAuthor).toBeVisible();
            await expect(previewDate).toBeVisible();
            await expect(backToEditingButton).toBeVisible();
        });
    });
});