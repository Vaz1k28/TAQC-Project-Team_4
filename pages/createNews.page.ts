import { Locator, Page, expect } from '@playwright/test';

export class CreateNewsPage {
  readonly page: Page;
  
  
  readonly fieldsInOrder: Locator[];

  
  readonly titleCounter: Locator;
  readonly titleFullCounter: Locator;
  readonly newsTag: Locator;
  readonly educationTag: Locator;
  readonly eventsTag: Locator;
  readonly initiativesTag: Locator;
  readonly pictureDropzone: Locator;
  readonly pictureBrowse: Locator;
  readonly contentText: Locator;
  readonly contentDiv: Locator;
  readonly authorContainer: Locator;
  readonly authorValue: Locator;
  readonly dateContainer: Locator;
  readonly dateValue: Locator;
  readonly sourceText: Locator;

  // Локатори кнопок
  readonly cancelBtn: Locator;
  readonly previewBtn: Locator;
  readonly createBtn: Locator;
  readonly publishBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Всі "текстури" та рядки прописані прямо тут, без жодних зовнішніх імпортів
    this.titleCounter = page.getByText('Title 0/');
    this.titleFullCounter = page.getByText('Title 0/170');
    
    this.newsTag = page.locator('a').filter({ hasText: /^News$/ });
    this.educationTag = page.locator('a').filter({ hasText: 'Education' });
    this.eventsTag = page.locator('a').filter({ hasText: /^Events$/ });
    this.initiativesTag = page.locator('a').filter({ hasText: 'Initiatives' });
    
    this.pictureDropzone = page.getByText('Picture (optional) Drop your');
    this.pictureBrowse = page.getByText('browse');
    
    this.contentText = page.getByText('Content Must be minimum 20');
    this.contentDiv = page.locator('div').filter({ hasText: 'Content Must be minimum 20' }).nth(5);
    
    this.authorContainer = page.locator('p').filter({ hasText: 'Author:' });
    this.authorValue = this.authorContainer.locator('span').nth(1);
    
    this.dateContainer = page.locator('p').filter({ hasText: 'Date:' });
    this.dateValue = this.dateContainer.locator('span').nth(1);
    
    this.sourceText = page.getByText(/Source \(optional\)/);

    this.cancelBtn = page.locator('button').filter({ hasText: /^Cancel$/ });
    this.previewBtn = page.locator('button').filter({ hasText: 'Preview' });
    this.createBtn = page.locator('button').filter({ hasText: 'Create' });
    this.publishBtn = page.locator('button').filter({ hasText: 'Publish' });

    
    this.fieldsInOrder = [
      this.titleFullCounter,
      this.newsTag,
      this.pictureDropzone,
      this.contentText,
      this.authorContainer,
      this.dateContainer,
      this.sourceText
    ];
  }

  
  async verifyFormLoaded() {
    await expect(this.titleFullCounter).toBeVisible();
    await expect(this.authorContainer).toBeVisible();
  }

  
  async verifyFieldsLayoutOrder() {
    for (let i = 0; i < this.fieldsInOrder.length - 1; i++) {
      const currentBox = await this.fieldsInOrder[i].boundingBox();
      const nextBox = await this.fieldsInOrder[i + 1].boundingBox();

      expect(currentBox).not.toBeNull();
      expect(nextBox).not.toBeNull();
      
      if (currentBox && nextBox) {
        expect(nextBox.y).toBeGreaterThanOrEqual(currentBox.y);
      }
    }
  }

  
  async interactWithTags() {
    await expect(this.newsTag).toBeVisible();
    await this.newsTag.click();
    await this.educationTag.click();
    await this.eventsTag.click();
    await this.educationTag.click();
    await this.initiativesTag.click();
  }

  
  async verifyFormFieldsAttributes() {
    
    await expect(this.titleCounter).toBeVisible();
    await expect(this.titleFullCounter).toBeVisible();

    
    await expect(this.pictureDropzone).toBeVisible();
    await expect(this.pictureBrowse).toBeVisible();

    
    await expect(this.contentText).toBeVisible();
    await expect(this.contentDiv).toBeVisible();

    
    await expect(this.authorValue).not.toBeEmpty();
    await expect(this.authorValue).not.toHaveAttribute('contenteditable', 'true');

    
    await expect(this.dateValue).not.toBeEmpty();
    await expect(this.dateValue).not.toHaveAttribute('contenteditable', 'true');

    
    await expect(this.sourceText).toBeVisible();
  }

  
  async verifyControlButtons() {
    await expect(this.cancelBtn).toBeVisible();
    
    if (await this.createBtn.isVisible()) {
      await expect(this.createBtn).toBeVisible();
    } else {
      await expect(this.previewBtn).toBeVisible();
    }
  }
}
