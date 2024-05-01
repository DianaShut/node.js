import * as fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "./user.interface";

const filePath = path.join(process.cwd(), "db.json");

const reader = async (): Promise<IUser[]> => {
  // Читаємо дані з файлу "db.json" як рядок
  const users = await fs.readFile(filePath, "utf-8");
  // Перетворюємо рядок у масив користувачів
  return JSON.parse(users);
};

const writer = async (users: IUser[]): Promise<void> => {
  // Записуємо масив користувачів у файл "db.json"
  await fs.writeFile(filePath, JSON.stringify(users));
};

export { reader, writer };
