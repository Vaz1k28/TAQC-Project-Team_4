import { Page, test } from '@playwright/test';

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

            await this.page.getByAltText('language switcher').click();

            await this.page.getByText('En', { exact: true }).click();

        });
    }

    async login() {

        await test.step('Login to the application', async () => {

            await this.page
                .getByRole('img', { name: 'sing in button' })
                .click();

            await this.page
                .getByRole('textbox', { name: 'Email' })
                .fill(process.env.USER_EMAIL as string);

            await this.page
                .getByRole('textbox', { name: 'Password' })
                .fill(process.env.USER_PASSWORD as string);

            await this.page
                .getByRole('button', { name: 'Sign in', exact: true })
                .click();

        });
    }

    async openCreateNewsPage() {

        await test.step('Navigate to create news page', async () => {

            await this.page.goto(
                'https://www.greencity.cx.ua/#/greenCity/news/create-news'
            );

        });
    }
}