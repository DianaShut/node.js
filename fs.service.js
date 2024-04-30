const fs = require('node:fs/promises');
const path = require('node:path');

// Формування шляху до файлу db.json у поточній директорії робочого каталогу
const filePath = path.join(process.cwd(), 'db.json');

// Асинхронна функція для читання даних з файлу db.json та їх парсингу в JSON
const reader = async () => {
    const users = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(users);
}

// Асинхронна функція для запису даних у файл db.json
const writer = async (users) => {
    await fs.writeFile(filePath, JSON.stringify(users))
}

// Експорт функцій для використання в інших модулях
module.exports = {reader, writer};
