import { IPrivateUser, IPublicUser, IUser } from "../interfaces/user.interface";

//Визначення класу UserPresenter, який буде містити методи для перетворення даних користувача
export class UserPresenter {
  //Статичний метод toPublicResponseDto, який отримує об'єкт користувача типу IUser і повертає об'єкт типу IPublicUser. Цей метод конвертує об'єкт користувача в публічну версію з обмеженим набором даних, які доступні для відображення.
  public static toPublicResponseDto(user: IUser): IPublicUser {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
    };
  }
  public static toPublicResponseListDto(users: IUser[]): IPublicUser[] {
    //Використання методу map для перетворення кожного об'єкта користувача в публічну версію за допомогою методу toPublicResponseDto
    return users.map(UserPresenter.toPublicResponseDto);
  }

  public static toPrivateResponseDto(user: IUser): IPrivateUser {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      role: user.role,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
    };
  }
}
