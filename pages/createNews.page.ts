import { expect, test } from '@playwright/test';
import { BasePage } from './base.page';

export class CreateNewsPage extends BasePage {
    // Локатори елементів форми
    get titleInput() { return this.page.getByPlaceholder('e.g. Coffee takeaway with 20'); }
    get titleLabel() { return this.page.locator('label, span, h3').filter({ hasText: 'Title' }).first(); }
    get titleCounter() { return this.page.locator('span, p').filter({ hasText: /0\s*([\s\S]*)\/\s*170/ }).first(); }
    
    get tagsHeading() { return this.page.locator('h3, h4, label, p').filter({ hasText: /Pick tags/i }).first(); }
    get pictureHeading() { return this.page.locator('h3, h4, label, p').filter({ hasText: /Picture/i }).first(); }
    get editor() { return this.page.locator('.ql-editor, textarea[formcontrolname="text"], .textarea-wrapper'); }
    get sourceInput() { return this.page.locator('input[placeholder*="Link"], input[placeholder*="Source"], input[formcontrolname="source"]'); }

    get cancelButton() { return this.page.locator('button').filter({ hasText: /Cancel/i }).first(); }
    get previewButton() { return this.page.locator('button').filter({ hasText: /Preview/i }).first(); }
    get publishButton() { return this.page.locator('button').filter({ hasText: /Publish/i }).first(); }

    // Локатори назв полів (лейблів)
    get dateInputField() { return this.page.locator('span, p, div').filter({ hasText: 'Date' }).first(); }
    get authorInputField() { return this.page.locator('span, p, div').filter({ hasText: 'Author' }).first(); }


    async verifyCreateNewsFormLayout() {
        await test.step('Wait for Create News form to be loaded', async () => {
            await expect(this.titleInput).toBeVisible({ timeout: 10000 });
        });

        await test.step('Verify visibility of all core elements and fields', async () => {
            await expect.soft(this.titleLabel, 'Title label should be visible').toBeVisible();
            await expect.soft(this.titleInput, 'Title input field should be visible').toBeVisible();
            await expect.soft(this.titleCounter, 'Title character counter should be visible').toBeVisible();
            await expect.soft(this.tagsHeading, 'Tags heading section should be visible').toBeVisible();
            await expect.soft(this.pictureHeading, 'Picture heading section should be visible').toBeVisible();
            await expect.soft(this.editor, 'Text editor field should be visible').toBeVisible();
            await expect.soft(this.authorInputField, 'Author input field should be visible').toBeVisible();
            await expect.soft(this.dateInputField, 'Date input field should be visible').toBeVisible();
            await expect.soft(this.sourceInput, 'Source link input should be visible').toBeVisible();
            await expect.soft(this.cancelButton, 'Cancel button should be visible').toBeVisible();
        });

        await test.step('Verify the precise vertical order of the fields from top to bottom', async () => {
            const titleBox = await this.titleInput.boundingBox();
            const tagsBox = await this.tagsHeading.boundingBox();
            const pictureBox = await this.pictureHeading.boundingBox();
            const editorBox = await this.editor.boundingBox();
            const authorBox = await this.authorInputField.boundingBox(); 
            const dateBox = await this.dateInputField.boundingBox();     
            const sourceBox = await this.sourceInput.boundingBox();
            const buttonsBox = await this.cancelButton.boundingBox();

            if (titleBox && tagsBox && pictureBox && editorBox && authorBox && dateBox && sourceBox && buttonsBox) {
                await expect.soft(titleBox.y, 'Title field should be above Tags section').toBeLessThan(tagsBox.y);       
                await expect.soft(tagsBox.y, 'Tags section should be above Picture field').toBeLessThan(pictureBox.y);     
                await expect.soft(pictureBox.y, 'Picture field should be above Text Editor').toBeLessThan(editorBox.y);   
                
                // Перевірка порядку для полей заповнених автоматично
                await expect.soft(editorBox.y, 'Text Editor should be above Author field').toBeLessThan(authorBox.y);   
                await expect.soft(authorBox.y, 'Author field should be above Date field').toBeLessThan(dateBox.y);       
                await expect.soft(dateBox.y, 'Date field should be above Source input').toBeLessThan(sourceBox.y);       
                
                await expect.soft(sourceBox.y, 'Source input should be above Action buttons').toBeLessThan(buttonsBox.y);   
            } else {
                expect.soft(titleBox, 'Title bounding box calculation failed').not.toBeNull();
                expect.soft(tagsBox, 'Tags bounding box calculation failed').not.toBeNull();
                expect.soft(pictureBox, 'Picture bounding box calculation failed').not.toBeNull();
                expect.soft(editorBox, 'Editor bounding box calculation failed').not.toBeNull();
                expect.soft(authorBox, 'Author bounding box calculation failed').not.toBeNull();
                expect.soft(dateBox, 'Date bounding box calculation failed').not.toBeNull();
                expect.soft(sourceBox, 'Source bounding box calculation failed').not.toBeNull();
                expect.soft(buttonsBox, 'Buttons bounding box calculation failed').not.toBeNull();
            }
        });
    }

    async expectAuthorAndDateAreReadonly() {
        await test.step('Verify that Author and Date fields are visible and non-editable', async () => {

            await expect.soft(this.authorInputField, 'Author field should be visible').toBeVisible();
            await expect.soft(this.dateInputField, 'Date field should be visible').toBeVisible();


            const isAuthorEditable = await this.authorInputField.getAttribute('contenteditable');
            const isDateEditable = await this.dateInputField.getAttribute('contenteditable');

            await expect.soft(isAuthorEditable, 'Author element should not be contenteditable').not.toBe('true');
            await expect.soft(isDateEditable, 'Date element should not be contenteditable').not.toBe('true');
        });
    }
    
}