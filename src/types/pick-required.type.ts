//Цей код в TypeScript дефінує утилітарний тип PickRequired, який дозволяє вибирати з типу T підмножину властивостей, вказаних у K, і робити ці властивості обов'язковими, незалежно від того, чи були вони обов'язковими у вихідному типі T
export type PickRequired<T, K extends keyof T> = {
  [P in K]-?: T[P];
};

//-?: Цей модифікатор знака питання використовується для видалення необов'язковості з властивостей.
// [P in K]: Це перебір властивостей K типу T
// T[P]: Це тип властивості P типу T

//Приклад використання:
//interface User {
//   id: number;
//   name?: string;
//   email: string;
// }
// type RequiredUser = PickRequired<User, 'name' | 'email'>;
