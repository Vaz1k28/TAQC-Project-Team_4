import dote from 'dotenv'; 
import path from 'path';
dote.config({ path: path.resolve(__dirname, '..', '.env') }); 

const BASE_UI_URL = process.env.BASE_UI_URL || 'https://www.greencity.cx.ua/#/greenCity';
const HEADLESS = process.env.HEADLESS === 'true';

export { BASE_UI_URL, HEADLESS };