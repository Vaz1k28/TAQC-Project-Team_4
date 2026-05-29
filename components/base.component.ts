import { Page, Locator, expect } from '@playwright/test';

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