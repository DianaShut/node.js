module.exports = {
    extends: [
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser", //для того щоб eslint розумів ts
    plugins: ["@typescript-eslint", "simple-import-sort"],
    root: true,
    rules: {
        "no-console": ["error", { allow: ["warn", "error"] }], //дозволяємо використання console.warn, console.error
        "no-unused-vars": ["error", { argsIgnorePattern: "req|res|next" }], //дозволяємо не використані аргументи req, res, next
        "simple-import-sort/imports": "error", //сортування імпортів
        "simple-import-sort/exports": "error", //сортування експортів
    },
};