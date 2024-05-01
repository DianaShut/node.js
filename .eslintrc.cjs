module.exports = {
    env: {
        browser: true, //для браузера
        es2023: true, //для es2023
    },
    extends: [
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser", //для того щоб eslint розумів ts
    parserOptions: {
        ecmaVersion: "latest",
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort", "import"],
    root: true,
    rules: {
        // "no-console": ["error", { allow: ["warn", "error"] }], //дозволяємо використання console.warn, console.error
        "no-unused-vars": ["error", { argsIgnorePattern: "req|res|next" }], //дозволяємо не використані аргументи req, res, next
        "simple-import-sort/imports": "error", //сортування імпортів
        "simple-import-sort/exports": "error", //сортування експортів
        indent: ["error", 2], //відступи 2 пробіли
        quotes: ["error", "double"], //подвійні лапки
        semi: ["error", "always"], //крапка з комою
        "@typescript-eslint/interface-name-prefix": "off", //не вимагаємо префікс I в інтерфейсах
        "@typescript-eslint/explicit-function-return-type": "off", //не вимагаємо вказувати тип повернення функцій
        "@typescript-eslint/explicit-module-boundary-types": "off", //не вимагаємо вказувати типи в модулях
        "@typescript-eslint/no-explicit-any": "off", //дозволяємо використання any
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "req|res|next" }], //дозволяємо не використані аргументи req, res, next
        "@typescript-eslint/return-await": ["error", "always"], //вимагаємо await в return

        "import/first": "error", //імпорти повинні бути першими
        "import/newline-after-import": ["error", { count: 1 }], //після імпортів має бути 1 порожній рядок
        "import/no-duplicates": "error", //не дозволяємо дублювання імпортів
        "prettier/prettier": ["error", { endOfLine: "auto" }], //використовуємо налаштування prettier
        "sort-imports": [
            "error",
            {
                "ignoreCase": true, //не враховуємо регістр
                "ignoreDeclarationSort": true, //не враховуємо сортування за декларацією
                "ignoreMemberSort": false, //враховуємо сортування за членами
                "memberSyntaxSortOrder": ["none", "all", "multiple", "single"], //сортування за членами
                "allowSeparatedGroups": false, //не дозволяємо розділення груп
            },
        ],
    },
    ignorePatterns: ['.eslintrc.js', '/dist', '/data'], //ігноруємо файли
};
