import { Page , Locator} from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async clickElement(locator: Locator) {
        await locator.click();
    }

    async getTitle(locator: Locator): Promise<string> {
        return await this.page.title();
     
    }
    
    async isElementVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }
}