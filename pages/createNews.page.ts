import { expect, test } from '@playwright/test';
import { BasePage } from './base.page';
import { BASE_URL, USER_EMAIL, USER_PASSWORD } from '../components/base.component';

export class CreateNewsPage extends BasePage {
    // Головний контейнер форми
    get formContainer() { return this.page.locator('form, app-create-news'); }

    // =========================================================================
    // ЛОКАТОРИ ЕЛЕМЕНТІВ ФОРМИ (Getters)
    // =========================================================================
    get titleInput() { return this.page.getByPlaceholder('e.g. Coffee takeaway with 20'); }
    get titleLabel() { return this.formContainer.locator('label, span, h3').filter({ hasText: 'Title' }).first(); }
    get titleCounter() { return this.formContainer.locator('span, p').filter({ hasText: /0\s*([\s\S]*)\/\s*170/ }).first(); }
    
    get tagsHeading() { return this.formContainer.locator('h3, h4, label, p').filter({ hasText: /Pick tags/i }).first(); }
    get pictureHeading() { return this.formContainer.locator('h3, h4, label, p').filter({ hasText: /Picture/i }).first(); }

    get editor() { return this.formContainer.locator('.ql-editor, textarea[formcontrolname="text"]').first(); }
    get sourceInput() { return this.formContainer.locator('input[placeholder*="Link"], input[placeholder*="Source"], input[formcontrolname="source"]'); }

    get cancelButton() { return this.formContainer.locator('button').filter({ hasText: /Cancel/i }).first(); }
    get previewButton() { return this.formContainer.locator('button').filter({ hasText: /Preview/i }).first(); }
    get publishButton() { return this.formContainer.locator('button').filter({ hasText: /Publish/i }).first(); }

    get authorInputField() { return this.formContainer.locator('span, p, div, label').filter({ hasText: 'Author' }).first(); }
    get dateInputField() { return this.formContainer.locator('span, p, div, label').filter({ hasText: 'Date' }).first(); }

    // Локатори для роботи з файлами та зображеннями (TC-04)
    get fileInput() { return this.page.locator('input#upload[type="file"]'); }
    get dropzone() { return this.page.locator('div.dropzone'); }

    // Локатори для валідації основного тексту (TC-05)
    get mainTextError() { return this.page.getByText('Must be a minimum of 20 and a maximum of 63,206 symbols.'); }

    // Локатор контейнера відображення тегів на сторінці вже створеної новини (TC-03)
    get createdNewsTagsContainer() { return this.page.locator('#main-content'); }

    // Авторизаційні елементи
    get signInMenuButton() { return this.page.locator('.sign-in-link, a:has-text("Sign in")').first(); }
    get emailInputField() { return this.page.locator('input#email, input[formcontrolname="email"]'); }
    get passwordInputField() { return this.page.locator('input#password, input[formcontrolname="password"]'); }
    get submitLoginButton() { return this.page.locator('button[type="submit"]'); }

    tagButton(tagName: string) { 
        return this.formContainer.locator('button, .tag-button').filter({ hasText: new RegExp(`^${tagName}$`, 'i') }).first(); 
    }

    // =========================================================================
    // НАВІГАЦІЯ ТА СТРУКТУРНІ МЕТОДИ
    // =========================================================================
    override async openCreateNewsPage() {
        await test.step('Navigate to create news page with authorization handling', async () => {
            await this.page.goto((BASE_URL as string));
            
            if (await this.signInMenuButton.isVisible().catch(() => false)) {
                await this.signInMenuButton.click();
                await this.emailInputField.fill(USER_EMAIL as string);
                await this.passwordInputField.fill(USER_PASSWORD as string);
                await this.submitLoginButton.click();
                await this.page.waitForLoadState('networkidle');
            }
            
            await this.page.goto(`${BASE_URL}/create-news`);
            await expect(this.titleInput).toBeVisible();
        });
    }

    async verifyCreateNewsFormLayout() {
        await test.step('Wait for Create News form to be loaded', async () => {
            await expect(this.titleInput).toBeVisible();
        });

        await test.step('Verify visibility of all core elements and fields', async () => {
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

        await test.step('Verify the precise vertical order of the fields from top to bottom', async () => {
            const titleBox = await this.titleInput.boundingBox();
            const pictureBox = await this.pictureHeading.boundingBox();
            const tagsBox = await this.tagsHeading.boundingBox();
            const sourceBox = await this.sourceInput.boundingBox();
            const editorBox = await this.editor.boundingBox();
            const authorBox = await this.authorInputField.boundingBox(); 
            const dateBox = await this.dateInputField.boundingBox();     
            const buttonsBox = await this.cancelButton.boundingBox();

            if (titleBox && tagsBox && pictureBox && editorBox && authorBox && dateBox && sourceBox && buttonsBox) {
                await expect.soft(titleBox.y, 'Title field should be above Picture section').toBeLessThan(pictureBox.y);       
                await expect.soft(pictureBox.y, 'Picture field should be above Tags section').toBeLessThan(tagsBox.y);     
                await expect.soft(tagsBox.y, 'Tags section should be above Source input').toBeLessThan(sourceBox.y);   
                await expect.soft(sourceBox.y, 'Source input should be above Text Editor').toBeLessThan(editorBox.y);   
                await expect.soft(editorBox.y, 'Text Editor should be above Author field').toBeLessThan(authorBox.y);   
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

        await this.expectAuthorAndDateAreReadonly();
    }

    // =========================================================================
    // МЕТОДИ ВЗАЄМОДІЇ З ЕЛЕМЕНТАМИ 
    // =========================================================================
    async fillTitle(text: string) {
        await this.titleInput.fill(text);
    }

    async clearTitle() {
        await this.titleInput.click();
        await this.titleInput.press('ControlOrMeta+a');
        await this.titleInput.press('Backspace');
    }

    async typeTitleSequentially(text: string) {
        await this.titleInput.click();
        await this.titleInput.pressSequentially(text);
    }

    async selectTag(tagName: string) {
        await this.tagButton(tagName).click();
    }

    async fillMainText(text: string) {
        await this.editor.click();
        await this.editor.fill(text);
    }

    async clickPublish() {
        await this.publishButton.click();
    }

    async uploadImage(name: string, mimeType: string, buffer: Buffer, timeout?: number) {
        await this.fileInput.setInputFiles({ name, mimeType, buffer }, { timeout });
    }

    // =========================================================================
    // МЕТОДИ ПЕРЕВІРОК СТАНУ ТА ВАЛІДАЦІЙ 
    // =========================================================================
    async expectAuthorAndDateAreReadonly() {
        await test.step('Verify that Author and Date fields are visible and non-editable', async () => {
            await expect.soft(this.authorInputField, 'Author field should be visible').toBeVisible();
            await expect.soft(this.dateInputField, 'Date field should be visible').toBeVisible();

            const isAuthorEditable = await this.authorInputField.getAttribute('contenteditable');
            const isDateEditable = await this.dateInputField.getAttribute('contenteditable');

            await expect.soft(isAuthorEditable, 'Author element should not have contenteditable="true"').not.toBe('true');
            await expect.soft(isDateEditable, 'Date element should not have contenteditable="true"').not.toBe('true');
        });
    }

    async expectTitleBorderToBeRed() {
        await expect.soft(this.titleInput).toHaveCSS('border-color', /rgb\(255, 0, 0\)/);
    }

    async expectTitleBorderToNotBeRed() {
        await expect.soft(this.titleInput).not.toHaveCSS('border-color', /rgb\(255, 0, 0\)/);
    }

    async expectTitleValue(expectedText: string) {
        await expect.soft(this.titleInput).toHaveValue(expectedText);
    }

    async expectTitleCounterToHaveText(expectedText: string) {
        const dynamicCounter = this.formContainer.locator('span, p').filter({ hasText: /\d+\s*\/\s*170/ }).first();
        await expect.soft(dynamicCounter).toContainText(expectedText);
    }

    async expectCounterToBeRed() {
        const dynamicCounter = this.formContainer.locator('span, p').filter({ hasText: /\d+\s*\/\s*170/ }).first();
        await expect.soft(dynamicCounter).toHaveCSS('color', /rgb\(255, 0, 0\)/);
    }

    async expectPublishButtonToBeDisabled() {
        await expect.soft(this.publishButton).toBeDisabled();
    }

    async expectPublishButtonToBeEnabled() {
        await expect.soft(this.publishButton).toBeEnabled();
    }

    async expectCreatedNewsToContainTags(tags: string[]) {
        for (const tag of tags) {
            await expect.soft(this.createdNewsTagsContainer).toContainText(tag);
        }
    }

    async expectTagNotToBeActive(tagName: string) {
        await expect.soft(this.tagButton(tagName)).not.toHaveClass(/active/);
    }

    async expectImageUploadSuccess() {
        await expect.soft(this.page.getByText(/only PNG or JPEG/i)).not.toBeVisible();
        await expect.soft(this.dropzone).not.toHaveClass(/invalid|error/);
    }

    async expectImageValidationError(messagePattern: RegExp, classPattern: RegExp) {
        await expect.soft(this.page.getByText(messagePattern), `Validation message matching ${messagePattern} did not appear`).toBeVisible({ timeout: 5000 });
        await expect.soft(this.dropzone, `Dropzone class did not match ${classPattern}`).toHaveClass(classPattern);
    }

    async expectMainTextValidationError(expectedMessage: string) {
        await expect.soft(this.mainTextError, 'Main text error message should be visible').toBeVisible();
        await expect.soft(this.mainTextError).toContainText(expectedMessage);
        await expect.soft(this.mainTextError).toHaveCSS('color', /rgb\(255, 0, 0\)/);
    }

    async expectMainTextValidationHidden() {
        await expect.soft(this.mainTextError, 'Main text error message should be hidden').not.toBeVisible();
    }

    async expectMainTextLength(expectedLength: number) {
        const text = await this.editor.innerText();
        expect.soft(text.length, `Main text length should be truncated to ${expectedLength}`).toBe(expectedLength);
    }
}