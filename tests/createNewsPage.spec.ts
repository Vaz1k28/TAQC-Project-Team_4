import { test, expect } from '@playwright/test';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('GreenCity - Create News Form Validation', () => {
    let createNewsPage: CreateNewsPage;

    test.beforeEach(async ({ page }) => {
        createNewsPage = new CreateNewsPage(page);

        await createNewsPage.openHomePage();
        await createNewsPage.header.changeLanguage('En');
        await createNewsPage.header.openLoginPanel();
        await createNewsPage.loginPanel.login();
        await createNewsPage.openCreateNewsPage(); 
    });

    // =========================================================================
    // TC-01: Перевірка відображення полів форми
    // =========================================================================
    test('TC-01: Verify that the Create News form displays all the necessary fields in the correct order', async () => {
        await createNewsPage.verifyCreateNewsFormLayout();
    });

    // =========================================================================
    // TC-02: Валідація поля Title та статусів кнопки Publish
    // =========================================================================
    test('TC-02 Verify Title field validation and Publish button states', async () => {
        await test.step('Step 2: Leave the "Title" field empty', async () => {
            await createNewsPage.fillTitle('');
        });

        await test.step('Step 3: Check that the "Title" field border is highlighted in red', async () => {
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

    // =========================================================================
    // TC-03: Валідація лімітів вибору тегів (від 1 до 3)
    // =========================================================================
    test('TC-03: Verify tag selection limits (1 to 3 tags)', async () => {
        await test.step('Steps 1-5: Create news with a single tag ("News")', async () => {
            await createNewsPage.selectTag('News');
            await createNewsPage.fillTitle('Test');
            await createNewsPage.fillMainText('Test content with 20 chars');
            
            await createNewsPage.clickPublish();
            await createNewsPage.expectCreatedNewsToContainTags(['News']);
        });

        await test.step('Steps 6-9: Create news with three tags', async () => {
            await createNewsPage.openCreateNewsPage();
            
            await createNewsPage.selectTag('News');
            await createNewsPage.selectTag('Events');
            await createNewsPage.selectTag('Education');
            
            await createNewsPage.fillTitle('Test');
            await createNewsPage.fillMainText('Test content with 20 chars');
            
            await createNewsPage.clickPublish();
            await createNewsPage.expectCreatedNewsToContainTags(['News', 'Events', 'Education']);
        });

        await test.step('Steps 10-11: Verify that selecting a fourth tag is blocked', async () => {
            await createNewsPage.openCreateNewsPage();
            
            await createNewsPage.selectTag('News');
            await createNewsPage.selectTag('Events');
            await createNewsPage.selectTag('Education');
            
            await createNewsPage.selectTag('Initiatives');
            await createNewsPage.expectTagNotToBeActive('Initiatives');
        });
    });

    // =========================================================================
    // TC-04: Валідація поля "Upload Image"
    // =========================================================================
    test('TC-04: Verify the validation of the "Upload Image" field', async () => {
        test.setTimeout(60000); 

        // ---------------------------------------------------------------------
        // КРОКИ 2-3: Завантаження валідного PNG (5MB)
        // ---------------------------------------------------------------------
        await test.step('Steps 2-3: Upload a valid PNG file (size: 5MB) and check success', async () => {
            const validPngBuffer = Buffer.alloc(5 * 1024 * 1024);
            
            await createNewsPage.uploadImage('valid_image.png', 'image/png', validPngBuffer);
            await createNewsPage.expectImageUploadSuccess();
        });

        // ---------------------------------------------------------------------
        // КРОКИ 4-5: Завантаження невалідного GIF (1MB)
        // ---------------------------------------------------------------------
        await test.fail('Steps 4-5: Upload an invalid GIF file (size: 1MB) and check error', async () => {
    
            try {
                const invalidGifBuffer = Buffer.alloc(1 * 1024 * 1024);

                await createNewsPage.uploadImage('invalid_format.gif', 'image/gif', invalidGifBuffer, 5000);
                await createNewsPage.expectImageValidationError(/only PNG or JPEG/i, /invalid|error/);
            } catch (error) {
                expect.soft(error, 'Steps 4-5 failed: File input is detached or action timed out').toBeNull();
            }
        });

        // ---------------------------------------------------------------------
        // КРОКИ 6-7: Завантаження великого JPEG (15MB)
        // ---------------------------------------------------------------------
        
        await test.step('Steps 6-7: Upload a large JPEG file (size: 15MB) and check error', async () => {
            test.fail(true, 'Steps 6-7: Uploading a large file causes the file input to become detached, likely due to a page reload triggered by the error message. This is a known issue that needs to be addressed in the application code to prevent the page from reloading on validation errors.');
            try {
                const bigJpegBuffer = Buffer.alloc(15 * 1024 * 1024);

                await createNewsPage.uploadImage('too_large.jpeg', 'image/jpeg', bigJpegBuffer, 5000);
                await createNewsPage.expectImageValidationError(/less than 10\s*MB/i, /invalid|error/);
            } catch (error) {
                expect.soft(error, 'Steps 6-7 failed: File input is detached or action timed out').toBeNull();
            }
        });
    });

    // // =========================================================================
    // // TC-05: Валідація поля "Main Text"
    // // =========================================================================
    test('TC-05: Verify the validation of the "Main Text" field', async () => {
        
        await test.step('Steps 2-5: Enter too short text (10 chars), check red error message and disabled Publish button', async () => {
            await createNewsPage.fillMainText('Short text');
            
           
            await createNewsPage.titleInput.click(); 
            
            await createNewsPage.expectPublishButtonToBeDisabled();
            await createNewsPage.expectMainTextValidationError('Must be a minimum of 20 and a maximum of 63,206 symbols.');
        });

        await test.step('Steps 6-7: Enter 63,207 characters, check truncation to 63,206 and no error message', async () => {
            const baseText = 'A'.repeat(63205);
            await createNewsPage.fillMainText(baseText);


            await createNewsPage.editor.focus();
            await createNewsPage.page.keyboard.type('AA');

            // Перевіряємо, чи спрацювало обмеження самого редактора новини
            await createNewsPage.expectMainTextLength(63206);
            await createNewsPage.expectMainTextValidationHidden();
        });

        await test.step('Steps 8-9: Enter valid text (25 chars), select a tag, check that button becomes enabled and publish', async () => {
            await createNewsPage.selectTag('News'); 
            await createNewsPage.fillMainText('This is a valid test content'); 

            await createNewsPage.expectMainTextValidationHidden();
            await createNewsPage.expectPublishButtonToBeEnabled();
            
            await createNewsPage.clickPublish();
            await createNewsPage.expectCreatedNewsToContainTags(['News']);
        });
    });

});