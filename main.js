const path = require('node:path');
const fs = require('node:fs/promises');

async function foo() {
    try{
        // Створення змінної 'basePath', яка містить шлях до директорії 'baseFolder' в поточній робочій директорії.
        // Функція 'process.cwd()' повертає поточну робочу директорію виконання скрипта.
        const basePath = path.join(process.cwd(), 'baseFolder');

        // Спроба створити директорію за вказаним шляхом. Опція {recursive: true} дозволяє створювати вкладені директорії,якщо вони не існують. Якщо директорія 'baseFolder' вже існує, помилки не буде.
        await fs.mkdir(basePath, {recursive: true})

        const folderNames = ['folder1', 'folder2', 'folder3', 'folder4', 'folder5'];
        const filesNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt'];

        for(const folderName of folderNames) {
            const folderPath = path.join(basePath, folderName);
            await fs.mkdir(folderPath, {recursive: true});

            for (const fileName of filesNames) {
                await fs.writeFile(path.join(folderPath, fileName), 'Hello, World!');
            }
        }

        //Перевірка
        // Читаємо вміст директорії за шляхом, заданим у змінній basePath. result - масив назв файлів та папок, які знаходяться в basePath.
        const result = await fs.readdir(basePath)

        // Циклічно перебираємо кожен елемент (назву файлу або папки) з отриманого масиву result
        for (const folderName of result) {

            // Створюємо повний шлях до кожного елемента, об'єднуючи basePath та поточне ім'я з масиву result
            const folderPath = path.join(basePath, folderName)

            // Отримуємо метадані про файл або папку за допомогою fs.stat, що дозволяє нам дізнатися більше про елемент
            const stat = await fs.stat(folderPath);
            // Виводимо в консоль інформацію, чи є поточний елемент директорією
            console.log('STAT: isDirectory: ', stat.isDirectory());

            //Аналогічно
            const result = await fs.readdir(folderPath)
            for (const item of result) {
                const itemPath = path.join(folderPath, item)
                const stat = await fs.stat(itemPath);
                console.log('STAT: isDirectory: ', stat.isDirectory());
            }
        }
        
    }catch (e) {
        console.error(e)
    }
}

void foo();