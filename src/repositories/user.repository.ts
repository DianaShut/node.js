// Імпорт функцій reader та writer з модуля fs.service для зчитування і запису даних у файл.
import { reader, writer } from "../fs.service";
// Імпорт інтерфейсу IUser, який описує структуру об'єкта користувача.
import { IUser } from "../user.interface";

// Визначення класу UserRepository, який містить методи для роботи з користувачами.
class UserRepository {
  // Метод для отримання масиву користувачів.
  public async getAllUsers(): Promise<IUser[]> {
    return await reader();
  }

  // Метод для створення нового користувача. Приймає dto (Data Transfer Object), який містить часткові дані користувача.
  public async createUser(dto: Partial<IUser>): Promise<IUser> {
    const users = await reader(); // Читаємо існуючих користувачів.
    // Створення нового користувача, присвоєння йому наступного ID, і встановлення даних з dto.
    const newUser: IUser = {
      id: users[users.length - 1].id + 1,
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
    users.push(newUser); // Додаємо нового користувача в масив.

    await writer(users); // Записуємо оновлений масив користувачів у файл.
    return newUser; // Повертаємо нового користувача.
  }

  // Метод для отримання користувача за ID.
  public async getUserById(userId: number): Promise<IUser> {
    const users = await reader(); // Читаємо користувачів.
    return users.find((user) => user.id === userId); // Повертаємо користувача, якщо його ID співпадає.
  }

  // Метод для оновлення даних користувача за ID. Оновлює ім'я, email, і пароль.
  public async updateUser(userId: number, dto: Partial<IUser>): Promise<IUser> {
    const { name, email, password } = dto; // Деструктуризація dto.
    const users = await reader(); // Читаємо існуючих користувачів.
    const index = users.findIndex((user) => user.id === userId); // Знаходимо індекс користувача у масиві.
    users[index] = { ...users[index], name, email, password }; // Оновлюємо дані користувача.
    await writer(users); // Записуємо оновлений масив у файл.
    return users[index]; // Повертаємо оновленого користувача.
  }

  // Метод для видалення користувача за ID.
  public async deleteUser(userId: number): Promise<void> {
    const users = await reader(); // Читаємо існуючих користувачів.
    const index = users.findIndex((user) => user.id === userId); // Знаходимо індекс користувача.
    users.splice(index, 1); // Видаляємо користувача з масиву.
    await writer(users); // Записуємо оновлений масив у файл.
  }
}

// Експортуємо екземпляр UserRepository для використання в інших частинах програми.
export const userRepository = new UserRepository();
