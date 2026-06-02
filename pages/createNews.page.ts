import { expect, test } from '@playwright/test';
import { BasePage } from './base.page';

export class CreateNewsPage extends BasePage {
    // Головний контейнер форми для ізоляції локаторів від хедера/футера
    get formContainer() { return this.page.locator('form, app-create-news'); }

    // Локатори елементів форми (тепер шукають строго всередині контейнера форми)
    get titleInput() { return this.page.getByPlaceholder('e.g. Coffee takeaway with 20'); }
    get titleLabel() { return this.formContainer.locator('label, span, h3').filter({ hasText: 'Title' }).first(); }
    get titleCounter() { return this.formContainer.locator('span, p').filter({ hasText: /0\s*([\s\S]*)\/\s*170/ }).first(); }
    
    get tagsHeading() { return this.formContainer.locator('h3, h4, label, p').filter({ hasText: /Pick tags/i }).first(); }
    get pictureHeading() { return this.formContainer.locator('h3, h4, label, p').filter({ hasText: /Picture/i }).first(); }
    get editor() { return this.formContainer.locator('.ql-editor, textarea[formcontrolname="text"], .textarea-wrapper'); }
    get sourceInput() { return this.formContainer.locator('input[placeholder*="Link"], input[placeholder*="Source"], input[formcontrolname="source"]'); }

    get cancelButton() { return this.formContainer.locator('button').filter({ hasText: /Cancel/i }).first(); }
    get previewButton() { return this.formContainer.locator('button').filter({ hasText: /Preview/i }).first(); }
    get publishButton() { return this.formContainer.locator('button').filter({ hasText: /Publish/i }).first(); }

    // Локатори для тексту Автора та Дати всередині форми
    get authorInputField() { return this.formContainer.locator('span, p, div, label').filter({ hasText: 'Author' }).first(); }
    get dateInputField() { return this.formContainer.locator('span, p, div, label').filter({ hasText: 'Date' }).first(); }

    async verifyCreateNewsFormLayout() {
        await test.step('Wait for Create News form to be loaded', async () => {
            await expect(this.titleInput).toBeVisible({ timeout: 10000 });
        });

        await test.step('Verify visibility of all core elements and fields (Soft)', async () => {
            await expect.soft(this.titleLabel, 'Title label should be visible').toBeVisible();
            await expect.soft(this.titleInput, 'Title input field should be visible').toBeVisible();
            await expect.soft(this.titleCounter, 'Title character counter should be visible').toBeVisible();
            await expect.soft(this.tagsHeading, 'Tags heading section should be visible').toBeVisible();
            await expect.soft(this.pictureHeading, 'Picture heading section should be visible').toBeVisible();
            await expect.soft(this.editor, 'Text editor field should be visible').toBeVisible();
            await expect.soft(this.authorInputField, 'Author field should be visible').toBeVisible();
            await expect.soft(this.dateInputField, 'Date field should be visible').toBeVisible();
            await expect.soft(this.sourceInput, 'Source link input should be visible').toBeVisible();
            await expect.soft(this.cancelButton, 'Cancel button should be visible').toBeVisible();
        });

        await test.step('Verify the precise vertical order of the fields from top to bottom (Soft)', async () => {
            const titleBox = await this.titleInput.boundingBox();
            const pictureBox = await this.pictureHeading.boundingBox();
            const tagsBox = await this.tagsHeading.boundingBox();
            const sourceBox = await this.sourceInput.boundingBox();
            const editorBox = await this.editor.boundingBox();
            const authorBox = await this.authorInputField.boundingBox(); 
            const dateBox = await this.dateInputField.boundingBox();     
            const buttonsBox = await this.cancelButton.boundingBox();

            if (titleBox && tagsBox && pictureBox && editorBox && authorBox && dateBox && sourceBox && buttonsBox) {
                // 1. Заголовок знаходиться на самому верху
                await expect.soft(titleBox.y, 'Title field should be above Picture section').toBeLessThan(pictureBox.y);       
                
                // 2. Блок завантаження картинки йде вище секції вибору тегів
                await expect.soft(pictureBox.y, 'Picture field should be above Tags section').toBeLessThan(tagsBox.y);     
                
                // 3. Теги розташовані вище поля введення Source джерела
                await expect.soft(tagsBox.y, 'Tags section should be above Source input').toBeLessThan(sourceBox.y);   
                
                // 4. Поле Source знаходиться над основним текстовим редактором новини
                await expect.soft(sourceBox.y, 'Source input should be above Text Editor').toBeLessThan(editorBox.y);   
                
                // 5. Текстовий редактор знаходиться вище автоматичних системних полів
                await expect.soft(editorBox.y, 'Text Editor should be above Author field').toBeLessThan(authorBox.y);   
                
                // 6. Системні поля (Автор та Дата) йдуть паралельно або вище фінальних кнопок дій
                await expect.soft(authorBox.y, 'Author field should be above Action buttons').toBeLessThan(buttonsBox.y);       
                await expect.soft(dateBox.y, 'Date field should be above Action buttons').toBeLessThan(buttonsBox.y);       
            } else {
                expect.soft(titleBox, 'Title bounding box calculation failed').not.toBeNull();
                expect.soft(pictureBox, 'Picture bounding box calculation failed').not.toBeNull();
                expect.soft(tagsBox, 'Tags bounding box calculation failed').not.toBeNull();
                expect.soft(sourceBox, 'Source bounding box calculation failed').not.toBeNull();
                expect.soft(editorBox, 'Editor bounding box calculation failed').not.toBeNull();
                expect.soft(authorBox, 'Author bounding box calculation failed').not.toBeNull();
                expect.soft(dateBox, 'Date bounding box calculation failed').not.toBeNull();
                expect.soft(buttonsBox, 'Buttons bounding box calculation failed').not.toBeNull();
            }
        });

        // Автоматичний виклик перевірки на Readonly
        await this.expectAuthorAndDateAreReadonly();
    }

    async expectAuthorAndDateAreReadonly() {
        await test.step('Verify that Author and Date fields are visible and non-editable (Soft)', async () => {
            await expect.soft(this.authorInputField, 'Author field should be visible').toBeVisible();
            await expect.soft(this.dateInputField, 'Date field should be visible').toBeVisible();

            // Перевіряємо через перевірку HTML-атрибуту contenteditable (це найнадійніший варіант для тексту)
            const isAuthorEditable = await this.authorInputField.getAttribute('contenteditable');
            const isDateEditable = await this.dateInputField.getAttribute('contenteditable');

            await expect.soft(isAuthorEditable, 'Author element should not have contenteditable="true"').not.toBe('true');
            await expect.soft(isDateEditable, 'Date element should not have contenteditable="true"').not.toBe('true');
        });
    }
}