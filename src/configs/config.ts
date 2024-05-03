import dotenv from "dotenv"; //Імпортуємо бібліотеку dotenv

dotenv.config(); //Викликаємо метод config() для завантаження змінних середовища

export const config = {
  PORT: Number(process.env.PORT), //Витягуємо змінну PORT з файлу .env
  HOST: process.env.HOST, //Витягуємо змінну HOST з файлу .env
  MONGO_URL: process.env.MONGO_URL, //Витягуємо змінну MONGO_URL з файлу .env
};
