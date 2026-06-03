import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = process.env.BASE_URL;
const HEADLESS = process.env.HEADLESS;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

export { BASE_URL, HEADLESS, USER_EMAIL, USER_PASSWORD };
export class BaseComponent {
  
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  
  async expectToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  
  async expectToBeHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }
}
