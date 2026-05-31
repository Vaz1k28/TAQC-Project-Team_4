import { Page, test, expect } from '@playwright/test';
import { BaseTexture } from '../fixtures/base.texture';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openHomePage() {
        await test.step('Open home page', async () => {
            await this.page.goto(process.env.BASE_URL as string);
        });
    }

    async languageChange() {
        await test.step('Change language to English', async () => {
            await this.page
                .getByAltText(BaseTexture.language.switcherAlt)
                .click();

            await this.page
                .getByText(BaseTexture.language.english, { exact: true })
                .click();
        });
    }

    async login() {
        await test.step('Login to the application', async () => {
            await this.page
                .getByRole('img', { name: BaseTexture.login.signInImageAlt })
                .click();

            await this.page
                .getByRole('textbox', { name: BaseTexture.login.emailLabel })
                .fill(process.env.USER_EMAIL as string);

            await this.page
                .getByRole('textbox', { name: BaseTexture.login.passwordLabel })
                .fill(process.env.USER_PASSWORD as string);

            const signInBtn = this.page.getByRole('button', { name: BaseTexture.login.signInButtonName, exact: true });
            await signInBtn.click();

            await expect(signInBtn).toBeHidden();                
        });
    }

    async openCreateNewsPage() {
        await test.step('Navigate directly to create news page', async () => {
            await this.page.goto(`${process.env.BASE_URL}/create-news`);
        });
    }
}