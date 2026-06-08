import { test } from '@playwright/test';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('TC-06: GreenCity Create News - Source Field Validation', () => {
    let createNewsPage: CreateNewsPage;

    test.beforeEach(async ({ page }) => {
        createNewsPage = new CreateNewsPage(page);
        await createNewsPage.openCreateNewsPage();
    });

    test('Verify validation of the optional Source field', async () => {
        await test.step('Fill in mandatory fields', async () => {
            await createNewsPage.fillTitle('Coffee takeaway with 20% discount');
            await createNewsPage.selectTag('News');
            await createNewsPage.fillMainText('This is a valid news body text that has more than twenty characters.');
        });

        await test.step('Step 1: Verify that empty Source field allows publication', async () => {
            await createNewsPage.clearSource();
            await createNewsPage.expectSourceValidationErrorHidden();
            await createNewsPage.expectPublishButtonToBeEnabled();
        });

        await test.step('Step 2: Verify validation and error message for invalid URL', async () => {
            await createNewsPage.fillSource('www.example.com');
            await createNewsPage.expectPublishButtonToBeDisabled();
            await createNewsPage.expectSourceValidationErrorVisible();
        });

        await test.step('Step 3: Verify that valid URL clears error and enables publication', async () => {
            await createNewsPage.fillSource('https://example.com');
            await createNewsPage.expectSourceValidationErrorHidden();
            await createNewsPage.expectPublishButtonToBeEnabled();
            await createNewsPage.clickPublish();
        });
    });
});