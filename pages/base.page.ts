import { Page, test } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { LoginPanelComponent } from '../components/loginPanel.component';
import { BASE_URL } from '../components/base.component';

export class BasePage {
    readonly page: Page;
    public header: HeaderComponent;
    public loginPanel: LoginPanelComponent;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.loginPanel = new LoginPanelComponent(page);
    }

    async openHomePage() {
        await test.step('Open home page', async () => {
            await this.page.goto(BASE_URL as string);
        });
    }

    async openCreateNewsPage() {
        await test.step('Navigate directly to create news page', async () => {
            await this.page.goto(`${BASE_URL as string}/create-news`);
        });
    }
}