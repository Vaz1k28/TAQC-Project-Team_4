import dote from 'dotenv'; 
import path from 'path';
dote.config({ path: path.resolve(__dirname, '../.env') });


export const ENV = {
  BASE_URL: process.env.BASE_URL,
  HEADLESS: process.env.HEADLESS as string === 'false',
  USER_EMAIL: process.env.USER_EMAIL,
  USER_PASSWORD: process.env.USER_PASSWORD,
} as const
