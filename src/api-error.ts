// Оголошення класу ApiError, який наслідує вбудований клас Error.
export class ApiError extends Error {
    // Декларація публічної властивості 'status', яка призначена для зберігання HTTP статусу помилки.
    public status: number;

    constructor(message: string, status: number) {
        super(message);  // Виклик конструктора базового класу Error з параметром 'message'.
        this.status = status;  // Присвоєння значення параметра 'status' властивості 'status'.
    }
}
