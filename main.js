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
    }catch (e) {
        console.error(e)
    }
}

void foo();