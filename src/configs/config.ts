import dotenv from "dotenv"; //Імпортуємо бібліотеку dotenv

dotenv.config(); //Викликаємо метод config() для завантаження змінних середовища

export const config = {
  PORT: Number(process.env.PORT), //Витягуємо змінну PORT з файлу .env
  HOST: process.env.HOST, //Витягуємо змінну HOST з файлу .env
  MONGO_URL: process.env.MONGO_URL, //Витягуємо змінну MONGO_URL з файлу .env

  HASH_ROUNDS: Number(process.env.HASH_ROUNDS), //Витягуємо змінну HASH_ROUNDS з файлу .env

  FRONT_URL: process.env.FRONT_URL, //Витягуємо змінну FRONT_URL з файлу .env

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,
};
