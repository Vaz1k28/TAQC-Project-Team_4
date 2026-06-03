import { test } from '@playwright/test';
import { BaseComponent } from './base.component';
import { BaseTexture } from '../fixtures/base.texture'; 

export class HeaderComponent extends BaseComponent {
    // Твої рідні та стабільні локатори з BaseTexture
    get languageSwitcher() {
        return this.page.getByAltText(BaseTexture.language.switcherAlt);
    }

    get englishOption() {
        return this.page.getByText(BaseTexture.language.english, { exact: true });
    }

    get signInButton() {
        return this.page.getByRole('img', { name: BaseTexture.login.signInImageAlt });
    }

    // Метод, який зараз викликається у твоєму тесті TC-01
    async changeLanguage(lang: 'En' | 'Ua' = 'En') {
        await test.step(`Change UI language to ${lang}`, async () => {
            // Явно чекаємо появу перемикача мови на сторінці (до 10 секунд)
            await this.languageSwitcher.waitFor({ state: 'visible', timeout: 10000 });
            await this.languageSwitcher.click();

            if (lang === 'En') {
                await this.englishOption.waitFor({ state: 'visible', timeout: 5000 });
                await this.englishOption.click();
            } else {
                // Якщо знадобиться перемикання на UA, тимчасово клікаємо сюди ж або додайте свій BaseTexture.language.ukrainian
                await this.englishOption.click();
            }
        });
    }

    async openLoginPanel() {
        await test.step('Click Sign In icon in Header', async () => {
            await this.signInButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.signInButton.click();
        });
    }
}