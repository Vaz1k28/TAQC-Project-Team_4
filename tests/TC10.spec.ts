import { test, expect } from '@playwright/test';
import { allure } from '@playwright/allure-playwright';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('GreenCity News Editing', () => {
    let createNewsPage: CreateNewsPage;

    test.beforeEach(async ({ page }) => {
        createNewsPage = new CreateNewsPage(page);
        await createNewsPage.openCreateNewsPage();
    });

    test('TC-09: Author can edit own news and save changes', async ({ page }) => {
        allure.id('TC-09');
        allure.story('Редагування новини автором');
        allure.severity('critical');

        const editNewsButton = page.locator('button').filter({ hasText: /Edit news|Редагувати/i }).first();
        const newsTitleElement = page.locator('h1, .news-title').first();
        const newsTextElement = page.locator('.news-text, .ql-editor-preview').first();
        const newsDateElement = page.locator('.date, div.date').first();

        await allure.step('Створити новину та зафіксувати початкову дату створення', async () => {
            await createNewsPage.fillTitle('Original Title');
            await createNewsPage.fillMainText('Original content that has more than twenty characters');
            await createNewsPage.clickPublish();
            await page.waitForLoadState('networkidle');
        });

        const originalDate = await newsDateElement.innerText();

        await allure.step('Натиснути кнопку Edit news та змінити дані новини', async () => {
            await editNewsButton.click();
            await createNewsPage.clearTitle();
            await createNewsPage.fillTitle('Updated Title');
            await createNewsPage.fillMainText('Updated content that also contains more than twenty characters');
            await createNewsPage.publishButton.click();
            await page.waitForLoadState('networkidle');
        });

        await allure.step('Перевірити оновлені значення та незмінність дати створення', async () => {
            await expect(newsTitleElement).toHaveText('Updated Title');
            await expect(newsTextElement).toContainText('Updated content that also contains more than twenty characters');
            await expect(newsDateElement).toHaveText(originalDate);
        });
    });
});