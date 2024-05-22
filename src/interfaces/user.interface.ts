import { OrderEnum } from "../enums/order.enum";
import { RoleEnum } from "../enums/role.enum";
import { UserListOrderEnum } from "../enums/user-list-order.enum";

export interface IUser {
  _id: string; //_id є стандартною назвою для поля, яке використовується як унікальний ідентифікатор документа в колекції MongoDB
  name: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  role: RoleEnum;
  avatar: string;
  isDeleted: boolean;
  isVerified: boolean;
}

export interface IPublicUser {
  _id: string;
  name: string;
  email: string;
  age: number;
  role: RoleEnum;
  avatar: string;
  isDeleted: boolean;
  isVerified: boolean;
}

export interface IPrivateUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  role: RoleEnum;
  avatar: string;
  isDeleted: boolean;
  isVerified: boolean;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: UserListOrderEnum; // Це поле вказує за яким полем сортувати дані
  order?: OrderEnum; // Це поле вказує напрямок сортування даних

  [key: string]: any; // Це поле дозволяє додавати будь-які інші поля в запиті
}

export interface IUserListResponse extends IUserListQuery {
  data: IPublicUser[];
} // Цей інтерфейс використовується для відповіді на запити списку користувачів
