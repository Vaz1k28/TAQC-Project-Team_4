import { expect, Page } from '@playwright/test';

export class CreateNewsPage {
    constructor(private page: Page) {}

    // ===== Locators =====

    get titleInput() { return this.page.getByText('Title 0/'); }
    get tagInput() { return this.page.getByPlaceholder('e.g. Coffee takeaway with 20'); }
    get tagsHeading() { return this.page.getByRole('heading', { name: 'Pick tags for news' }); }
    get tagLimitMessage() { return this.page.getByText('Only 3 tags can be added'); }

    get newsLink() { return this.page.locator('a').filter({ hasText: /^News$/ }); }
    get eventsLink() { return this.page.locator('a').filter({ hasText: /^Events$/ }); }
    get educationLink() { return this.page.locator('a').filter({ hasText: 'Education' }); }
    get initiativesLink() { return this.page.locator('a').filter({ hasText: 'Initiatives' }); }
    get adsLink() { return this.page.locator('a').filter({ hasText: 'Ads' }); }

    get pictureHeading() { return this.page.getByRole('heading', { name: 'Picture (optional)' }); }
    get pictureWrapper() { return this.page.locator('.text-wrapper'); }
    get dropImageText() { return this.page.getByText('Drop your image here or browse'); }

    get sourceInput() { return this.page.getByPlaceholder('Link to external source'); }

    get editorToolbar() { return this.page.locator('.ql-toolbar'); }
    get editor() { return this.page.locator('.ql-editor'); }

    get dateText() { return this.page.getByText('Date:'); }
    get authorText() { return this.page.getByText('Author:'); }

    get cancelButton() { return this.page.locator('button').filter({ hasText: /^Cancel$/ }); }
    get previewButton() { return this.page.getByRole('button', { name: 'Preview' }); }
    get publishButton() { return this.page.getByRole('button', { name: 'Publish' }); }

    async checkElementsVisibility() {
        const elements = [
            { locator: this.titleInput, name: 'Title input field' },
            { locator: this.tagInput, name: 'Tag input field' },
            { locator: this.tagsHeading, name: 'Tags heading' },
            { locator: this.tagLimitMessage, name: 'Tag limit message' },

            { locator: this.newsLink, name: 'News link' },
            { locator: this.eventsLink, name: 'Events link' },
            { locator: this.educationLink, name: 'Education link' },
            { locator: this.initiativesLink, name: 'Initiatives link' },
            { locator: this.adsLink, name: 'Ads link' },

            { locator: this.pictureHeading, name: 'Picture heading' },
            { locator: this.pictureWrapper, name: 'Picture wrapper' },
            { locator: this.dropImageText, name: 'Drop image text' },

            { locator: this.sourceInput, name: 'Source input' },

            { locator: this.editorToolbar, name: 'Editor toolbar' },
            { locator: this.editor, name: 'Editor' },

            { locator: this.dateText, name: 'Date text' },
            { locator: this.authorText, name: 'Author text' },

            { locator: this.cancelButton, name: 'Cancel button' },
            { locator: this.previewButton, name: 'Preview button' },
            { locator: this.publishButton, name: 'Publish button' },
        ];

        for (const element of elements) {
            await expect.soft(
                element.locator,
                `${element.name} is not visible`
            ).toBeVisible();
        }
    }
}