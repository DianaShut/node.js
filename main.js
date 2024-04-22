//Модуль для роботи зі шляхами файлів
const path = require('node:path');

// Дозволяє інтерактивно взаємодіяти з користувачем через командний рядок
const readline = require('node:readline/promises');

//fs-робота з файлами, включно з читанням, записом, перейменуванням, створенням каталогів, видаленням файлів
//promises-дозволяє асинхронно виконувати операції
const fsPromises = require('node:fs/promises');

//OS: Виведення інформації про систему
const os = require('node:os');

//Дозволяє створювати та обробляти події
const EventEmitter = require('node:events');

//Модуль для створення HTTP серверів
const http = require('node:http');


async function foo() {
    try {
        // TODO: path

        // Виведення повного шляху до поточного файлу
        console.log(__filename)

        // Виведення назви файлу з розширенням з повного шляху
        console.log(path.basename(__filename));

        // Виведення шляху до директорії поточного файлу
        console.log(path.dirname(__filename));

        // Виведення розширення поточного файлу
        console.log(path.extname(__filename));

        // Розбирання повного шляху на об'єкт, що містить окремі компоненти шляху
        console.log(path.parse(__filename));

        // Створення нового шляху шляхом комбінування декількох сегментів
        console.log(path.join(__dirname, 'foo', 'bar', 'baz'));

        // Нормалізація шляху, виправляючи зайві або помилкові слеші
        console.log(path.normalize('/home////maksym\////WORK/\///Lessons/////nodejs-sept-2023'));

        // Перевірка, чи є шлях абсолютним
        console.log(path.isAbsolute('/home/maksym/WORK/Lessons/nodejs-sept-2023')); //true
        console.log(path.isAbsolute('./home/maksym/WORK/Lessons/nodejs-sept-2023')); //false


        // TODO: readline

        // Створення інтерфейсу для зчитування вводу з командного рядка
        const rl = readline.createInterface({

        // input: process.stdin вказує, що вводитимуться дані через стандартний ввід
            input: process.stdin,

        // output: process.stdout вказує, що вивід відбуватиметься через стандартний вивід
            output: process.stdout
        })

        // Запит у користувача імені з використанням асинхронної функції question, яка повертає проміс
        // Текст запиту 'Enter your name: ' виведеться користувачу, і він зможе ввести відповідь
        const name = await rl.question('Enter your name: ')

        // Вивід вітання з іменем, введеним користувачем
        console.log(`Hello, ${name}!`);

        const age = await rl.question('Enter your age: ')
        console.log(`You are ${age} years old!`);
        //важливо закрити інтерфейс після завершення вводу/виводу для звільнення ресурсів
        rl.close();


        // TODO: fs

        // Створюємо шлях до файлу 'test2.txt', що знаходиться у піддиректорії 'www' відносно директорії, де знаходиться поточний скрипт
        const pathToTestFile = path.join(__dirname, 'www','test2.txt')

        // Створюємо файл або перезаписуємо його, якщо він існує, з текстом 'Hello, Node.js! 2'
        await fsPromises.writeFile(pathToTestFile, 'Hello, Node.js! 2')

        // Читаємо вміст файлу 'test2.txt' використовуючи кодування 'utf-8'
        const data = await fsPromises.readFile(pathToTestFile, 'utf-8')
        console.log(data);

        // Додаємо рядок '\nHello, Node.js! 3' до кінця файлу 'test2.txt'
        await fsPromises.appendFile(pathToTestFile, '\nHello, Node.js! 3')

        // Перейменовуємо файл 'test2.txt' в 'test3.txt'
        await fsPromises.rename(pathToTestFile, path.join(__dirname,'test3.txt'))

        // Створюємо директорію 'foo/bar' відносно директорії поточного скрипта, використовуючи параметр {recursive: true}, що дозволяє створювати вкладені директорії
        await fsPromises.mkdir(path.join(__dirname, 'foo', 'bar'), {recursive: true})

        // Створюємо файл 'qwe.txt' в директорії 'foo/bar' з текстом 'Hello, Node.js! 2'
        await fsPromises.writeFile(path.join(__dirname, 'foo', 'bar', 'qwe.txt'), 'Hello, Node.js! 2')

        // Видаляємо директорію 'foo/bar' разом з усім її вмістом
        await fsPromises.rmdir(path.join(__dirname, 'foo', 'bar'), {recursive: true})

        // Видаляємо файл 'test.txt'
        await fsPromises.unlink(path.join(__dirname, 'test.txt'))

        // Копіюємо файл 'test2.txt' з піддиректорії 'www' до нового файлу 'copy-test2.txt'
        await fsPromises.copyFile(path.join(__dirname, 'www', 'test2.txt'), path.join(__dirname, 'copy-test2.txt'))

        // Отримуємо статистику файлу 'copy-test2.txt' та перевіряємо, чи є цей шлях директорією
        const stats = await fsPromises.stat(path.join(__dirname, 'copy-test2.txt'))
        console.log(stats.isDirectory())


        // TODO os

        // Виводить архітектуру процесора системи, наприклад, 'x64', 'arm', 'ia32'
        console.log(os.arch())

        // Виводить масив об'єктів, кожен з яких містить інформацію про кожен ЦПУ/ядер процесора системи
        console.log(os.cpus())

        // Виводить шлях до домашньої директорії поточного користувача
        console.log(os.homedir())

        // Виводить ім'я хоста операційної системи
        console.log(os.hostname())

        // Виводить версію операційної системи
        console.log(os.version())

        // Виводить платформу операційної системи, наприклад 'darwin', 'win32', 'linux'
        console.log(os.platform())

        // Виводить час роботи системи в днях
        console.log(os.uptime() / 60 / 60 / 24)

        // Виводить загальний об'єм пам'яті системи в байтах
        console.log(os.totalmem())

        // Виводить кількість вільної пам'яті системи в байтах
        console.log(os.freemem())

        // Виводить об'єкт з інформацією про всі мережеві інтерфейси, доступні в системі.
        console.log(os.networkInterfaces())


        // TODO Events

        // Створення нового екземпляру EventEmitter для управління подіями
        const myEmitter = new EventEmitter()

        // Реєстрація обробника події 'www', який викликається кожен раз, коли подія 'www' відбувається
        // Функція обробника отримує параметри, передані в `emit` і виводить їх у консоль
        myEmitter.on('www', (...args) => {
            console.log('an event occurred! : ', args)
        })

        // Реєстрація обробника для події 'once-event', який викликається лише один раз
        // Після першого виклику, обробник буде автоматично видалений
        myEmitter.once('once-event', () => {
            console.log('once-event event occurred!')
        })

        // Виклик події 'www' з аргументами 234 і 455. Обробник вище виведе ці значення.
        myEmitter.emit('www', 234, 455)

        // Виклик події 'www' без аргументів. Обробник виведе пустий масив, оскільки аргументи відсутні.
        myEmitter.emit('www')

        // Повторний виклик події 'www' з одним аргументом 234222
        myEmitter.emit('www', 234222)

        // Виклик події 'once-event' вперше. Виконається відповідний обробник
        myEmitter.emit('once-event')
        // Наступні виклики події 'once-event' не матимуть ефекту, оскільки обробник вже викликався і був видалений.
        myEmitter.emit('once-event')
        myEmitter.emit('once-event')
        myEmitter.emit('once-event')


        // TODO HTTP server

        // Створення HTTP серверу. Функція createServer приймає колбек, який викликається при кожному HTTP запиті до серверу.
        const server = http.createServer((req, res) => {
            // Обробник запитів. Коли сервер отримує запит, він відправляє відповідь 'okay'
            res.end('okay');
        });

        // Метод listen використовується для прив'язки серверу до певного порту та інтерфейсу
        // Сервер слухатиме запити на порті 3000 на всіх мережевих інтерфейсах (0.0.0.0)
        server.listen(3000, '0.0.0.0', () => {
            // Коли сервер почне слухати запити, буде виведено повідомлення в консоль
            console.log('Server is running at http://0.0.0.0:3000/');
        })

        // Блок catch використовується для перехоплення та обробки виключень, якщо вони виникнуть у блоку try
    } catch (e) {
        // Якщо під час виконання коду в блоку try виникне помилка, вона буде виведена в консоль
        console.error(e)
    }
}

void foo();