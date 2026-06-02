import dote from 'dotenv'; 
import path from 'path';
dote.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = process.env.BASE_URL
const HEADLESS = process.env.HEADLESS as string === 'false' ? false : true;
const USER_EMAIL = process.env.USER_EMAIL;
const PASSWORD = process.env.PASSWORD;

export { BASE_URL, HEADLESS, USER_EMAIL, PASSWORD };