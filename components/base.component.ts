import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_UI_URL = process.env.BASE_UI_URL;
const HEADLESS = process.env.HEADLESS === 'false' ? false : true;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

export { BASE_UI_URL, HEADLESS, USER_EMAIL, USER_PASSWORD };
export class BaseComponent {
  
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  
  async expectToBeVisible(locator: Locator, timeout = 5000) {
    await expect(locator).toBeVisible({ timeout });
  }

  
  async expectToBeHidden(locator: Locator, timeout = 5000) {
    await expect(locator).toBeHidden({ timeout });
  }
}
