import { expect, test } from '@playwright/test';
import { BaseComponent, USER_EMAIL, USER_PASSWORD } from './base.component';
import { BaseTexture } from '../fixtures/base.texture';

export class LoginPanelComponent extends BaseComponent {
    // Твої оригінальні локатори інпутів форми авторизації
    get emailInput() {
        return this.page.getByRole('textbox', { name: BaseTexture.login.emailLabel });
    }

    get passwordInput() {
        return this.page.getByRole('textbox', { name: BaseTexture.login.passwordLabel });
    }

    get signInSubmitButton() {
        return this.page.getByRole('button', { name: BaseTexture.login.signInButtonName, exact: true });
    }

    async login(email = USER_EMAIL, pass = USER_PASSWORD || process.env.USER_PASSWORD) {
        await test.step('Login to the application', async () => {
            if (!email || !pass) {
                throw new Error('Login failed: Credentials are missing in .env file');
            }

            await this.emailInput.fill(email);
            await this.passwordInput.fill(pass);
            await this.signInSubmitButton.click();

            await expect(this.signInSubmitButton).toBeHidden();
        });
    }
}