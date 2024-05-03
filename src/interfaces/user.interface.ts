import { RoleEnum } from "../enums/role.enum";

export interface IUser {
  _id: string; //_id є стандартною назвою для поля, яке використовується як унікальний ідентифікатор документа в колекції MongoDB
  name: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  role: RoleEnum;
  isDeleted: boolean;
  isVerified: boolean;
}
