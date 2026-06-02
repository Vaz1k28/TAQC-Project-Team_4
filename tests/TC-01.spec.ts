import { test } from '@playwright/test';
import { CreateNewsPage } from '../pages/createNews.page';

test.describe('GreenCity - Create News Form Validation', () => {

  test('TC-01: Verify that the Create News form displays all the necessary fields in the correct order', async ({ page }) => {
    const createNewsPage = new CreateNewsPage(page);

    await test.step('Precondition: Navigate to Home Page', async () => {
        await createNewsPage.openHomePage();
    });

    await test.step('Precondition: Change language and Login to account via UI Components', async () => {
        // 1. Змінюємо мову через компонент хедера
        await createNewsPage.header.changeLanguage('En');
        
        // 2. Клікаємо на іконку входу в хедері, щоб відкрити модалку
        await createNewsPage.header.openLoginPanel();
        
        // 3. Заповнюємо форму і входимо (дані автоматично беруться з твого .env файлу)
        await createNewsPage.loginPanel.login();
    });

    await test.step('Navigate to the Create News page form directly', async () => {
        await createNewsPage.openCreateNewsPage();
    });

    // Валідація лейауту форми та перевірка readonly полів (Author / Date)
    await createNewsPage.verifyCreateNewsFormLayout();

    });

});