import { test } from '@playwright/test';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('GreenCity - Create News Form Validation', () => {
    let createNewsPage: CreateNewsPage;

    test.beforeEach(async ({ page }) => {
        createNewsPage = new CreateNewsPage(page);
    });

  test('TC-01: Verify that the Create News form displays all the necessary fields in the correct order', async ({ page }) => {
    

    await test.step('Precondition: Navigate to Home Page', async () => {
        await createNewsPage.openHomePage();
    });

    await test.step('Precondition: Change language and Login to account via UI Components', async () => {

        await createNewsPage.header.changeLanguage('En');
        
        await createNewsPage.header.openLoginPanel();
        
        await createNewsPage.loginPanel.login();
    });

    await test.step('Navigate to the Create News page form directly', async () => {
        await createNewsPage.openCreateNewsPage();
    });

    await createNewsPage.verifyCreateNewsFormLayout();

    });

    test('TC-02 Verify Title field validation and Publish button states', async ({ page }) => {
        

        await test.step('Step 1: Go directly to the Create News form', async () => {
            await createNewsPage.openCreateNewsPage();
        });

        await test.step('Step 2: Leave the "Title" field empty', async () => {
            await createNewsPage.fillTitle('');
        });

        await test.step('Step 3: Check that the "Title" field border is highlighted in red', async () => {
            // This check will flag a bug (if the border is not red), but the test will continue
            await createNewsPage.expectTitleBorderToBeRed();
        });

        await test.step('Step 4: Check that the "Publish" button is disabled', async () => {
            await createNewsPage.expectPublishButtonToBeDisabled();
        });

        await test.step('Step 5: Check that the character counter shows "0/170"', async () => {
            await createNewsPage.expectTitleCounterToHaveText('0/170');
        });

        await test.step('Step 6-7: Enter a string that exceeds 170 characters, check truncation to 170 and red counter', async () => {
            const longString = 'A'.repeat(171); 
            
            await createNewsPage.clearTitle();
            await createNewsPage.typeTitleSequentially(longString);


            await createNewsPage.expectTitleValue('A'.repeat(170)); 
            await createNewsPage.expectTitleCounterToHaveText('170/170'); 
            await createNewsPage.expectCounterToBeRed(); 
        });

        await test.step('Step 8-9: Enter a valid title, check the character counter «9/170» and the normal border', async () => {
            await createNewsPage.clearTitle();
            await createNewsPage.fillTitle('Test News');

            await createNewsPage.expectTitleCounterToHaveText('9/170');
            await createNewsPage.expectTitleBorderToNotBeRed();
        });

        await test.step('Step 10: Check that the "Publish" button is still disabled because the "Main Text" field is empty', async () => {
            await createNewsPage.expectPublishButtonToBeDisabled();
        });

        await test.step('Step 11: Select one of the tags (for example, "News")', async () => {
            await createNewsPage.selectTag('News');
        });

        await test.step('Step 12-13: Enter a valid text in the "Main Text" field and check that the button becomes enabled', async () => {
            await createNewsPage.fillMainText('This is a valid content for the news item.');
            await createNewsPage.expectPublishButtonToBeEnabled();
        });
    });

});