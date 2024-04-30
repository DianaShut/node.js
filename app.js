// Імпорт фреймворку Express для створення сервера
const express = require('express')
// Імпорт функцій reader та writer з локального модуля fs.service для читання та запису даних у файл
const {reader, writer} = require('./fs.service')

// Ініціалізація додатку Express
const app = express();

// Middleware для парсингу body JSON запитів
app.use(express.json());
// Middleware для парсингу вхідних даних, які були відправлені через HTML форми, extended: true дозволяє парсити об'єкти з вкладеною структурою
app.use(express.urlencoded({extended: true}));

// Обробка GET запиту для отримання всіх користувачів
app.get('/users', async (req, res) => {
    try {
        const users = await reader();  // Читаємо користувачів з файлу
        res.json(users);  // Відправляємо користувачів як JSON
    } catch (e) {
        res.status(400).json(e.message)  // У випадку помилки відправляємо статус 400 з повідомленням
    }
});

// Обробка POST запиту для створення нового користувача
app.post('/users', async (req, res) => {
    try {
        const {name, email, password} = req.body;  // Отримуємо дані нового користувача з тіла запиту

        const users = await reader();  // Читаємо існуючих користувачів

        // Створення нового користувача з унікальним ID
        const newUser = {id: users[users.length - 1].id + 1, name, email, password}
        users.push(newUser);  // Додаємо нового користувача до списку
        await writer(users);  // Записуємо оновлений список користувачів у файл
        res.status(201).json(newUser);  // Відправляємо статус 201 і дані нового користувача
    } catch (e) {
        res.status(400).json(e.message)
    }
})

// Обробка GET запиту для отримання конкретного користувача по ID
app.get('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);  // Перетворюємо параметр userId у число
        const users = await reader();

        // Шукаємо користувача по ID
        const user = users.find((user) => user.id === userId);
        if (!user) {
            throw new Error('user not found');  // Якщо не знайдено, кидаємо помилку
        }
        res.json(user);  // Відправляємо дані користувача
    } catch (e) {
        res.status(400).json(e.message)
    }
})

// Обробка PUT запиту для оновлення даних користувача
app.put('/users/:userId', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const userId = Number(req.params.userId);
        const users = await reader();

        // Шукаємо індекс користувача в масиві
        const index = users.findIndex((user) => user.id === userId);
        if (index === -1) {
            throw new Error('user not found');
        }
        // Оновлюємо дані користувача
        users[index] = {...users[index], name, email, password}
        await writer(users);

        res.status(201).json(users[index]);
    } catch (e) {
        res.status(400).json(e.message)
    }
})

// Обробка DELETE запиту для видалення користувача
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = await reader();

        // Шукаємо індекс користувача для видалення
        const index = users.findIndex((user) => user.id === userId);
        if (index === -1) {
            throw new Error('user not found');
        }
        users.splice(index, 1);  // Видаляємо користувача з масиву
        await writer(users);
        res.sendStatus(204);  // Відправляємо статус 204 No Content
    } catch (e) {
        res.status(400).json(e.message)
    }
})

// Запуск сервера на порту 3000
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}/`);
})

