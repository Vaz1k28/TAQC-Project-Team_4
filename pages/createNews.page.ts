import { Page, Locator, expect, test } from '@playwright/test';

export class CreateNewsPage {
  private readonly page: Page;

  // Form elements locators
  private readonly formTitle: Locator;
  private readonly titleInput: Locator;
  private readonly titleCounter: Locator;
  private readonly tagsLabel: Locator;
  private readonly newsTag: Locator;
  private readonly adsTag: Locator;
  private readonly eventsTag: Locator;
  private readonly pictureDropzone: Locator;
  private readonly contentInput: Locator;
  private readonly authorField: Locator;
  private readonly dateField: Locator;
  
  // Control buttons
  private readonly cancelBtn: Locator;
  private readonly previewBtn: Locator;
  private readonly publishBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initializing locators using stable Playwright locators
    this.formTitle = page.getByRole('heading', { name: /create news/i });
    this.titleInput = page.locator('textarea[placeholder="Enter title"]');
    this.titleCounter = page.getByText('Title 0/170');
    
    this.tagsLabel = page.getByText('Please select tags, max 3 tags');
    this.newsTag = page.locator('a').filter({ hasText: /^News$/ });
    this.adsTag = page.locator('a').filter({ hasText: /^Ads$/ });
    this.eventsTag = page.locator('a').filter({ hasText: /^Events$/ });

    this.pictureDropzone = page.getByText('Picture (optional) Drop your');
    this.contentInput = page.locator('textarea[placeholder="Enter text"]');
    
    // Readonly auto-filled fields
    this.authorField = page.locator('p').filter({ hasText: 'Author:' });
    this.dateField = page.locator('p').filter({ hasText: 'Date:' });

    // Bottom control buttons
    this.cancelBtn = page.getByRole('button', { name: /cancel/i });
    this.previewBtn = page.getByRole('button', { name: /preview/i });
    this.publishBtn = page.getByRole('button', { name: /publish/i });
  }

  /**
   * 1. Verify full form loading and element visibility
   */
  async verifyFormLoaded() {
    await test.step('Wait for main news form elements to be visible', async () => {
      await expect(this.titleInput).toBeVisible();
      await expect(this.contentInput).toBeVisible();
      await expect(this.authorField).toBeVisible();
    });
  }

  /**
   * 2. Verify fields vertical layout sequence (Layout Order) by Y-coordinate
   */
  async verifyFieldsLayoutOrder() {
    // Array of elements in strict visual order from top to bottom
    const fieldsToCompare = [
      { name: 'Title Counter Label', locator: this.titleCounter },
      { name: 'Tags Container (News Tag)', locator: this.newsTag },
      { name: 'Picture Dropzone Area', locator: this.pictureDropzone },
      { name: 'Author Information Field', locator: this.authorField }
    ];

    for (let i = 0; i < fieldsToCompare.length - 1; i++) {
      const current = fieldsToCompare[i];
      const next = fieldsToCompare[i + 1];

      await test.step(`Layout Check: "${current.name}" should be positioned above "${next.name}"`, async () => {
        const currentBox = await current.locator.boundingBox();
        const nextBox = await next.locator.boundingBox();

        // Check that elements are present in the DOM tree
        expect(currentBox).not.toBeNull();
        expect(nextBox).not.toBeNull();

        if (currentBox && nextBox) {
          // Next element's Y coordinate must be greater than or equal to the current one
          expect(nextBox.y).toBeGreaterThanOrEqual(currentBox.y);
        }
      });
    }
  }

  /**
   * 3. Verify interaction with tags (Selection and Deselection)
   */
  async interactWithTags() {
    await test.step('Click on "News" tag and verify its activation state', async () => {
      await this.newsTag.click();
      // Verify that the active status class is successfully applied
      await expect(this.newsTag).toHaveClass(/allure-active-tag|custom-active-class-here/); 
    });

    await test.step('Click on "News" tag again to verify its deactivation state', async () => {
      await this.newsTag.click();
      await expect(this.newsTag).not.toHaveClass(/allure-active-tag|custom-active-class-here/);
    });
  }

  /**
   * 4. Verify field attributes, placeholders, and system labels
   */
  async verifyFormFieldsAttributes() {
    await test.step('Validate inputs attributes, restrictions, and readonly fields', async () => {
      // Verify input placeholders
      await expect(this.titleInput).toHaveAttribute('placeholder', 'Enter title');
      
      // Verify text content for system auto-filled labels
      await expect(this.authorField).toContainText('Author:');
      await expect(this.dateField).toContainText('Date:');
    });
  }

  /**
   * 5. Verify presence and initial state of bottom control buttons
   */
  async verifyControlButtons() {
    await test.step('Verify availability and states of form control buttons', async () => {
      await expect(this.cancelBtn).toBeVisible();
      await expect(this.cancelBtn).toBeEnabled();

      await expect(this.previewBtn).toBeVisible();
      
      // Publish button should be disabled by default while form fields are empty
      await expect(this.publishBtn).toBeVisible();
      await expect(this.publishBtn).toBeDisabled();
    });
  }
}