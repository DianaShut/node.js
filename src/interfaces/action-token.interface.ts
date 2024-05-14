import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IUser } from "./user.interface";

export interface IForgotPassword extends Pick<IUser, "email"> {} // інтерфейс IForgot розширює інтерфейс IUser, але лише з полем email. Це використовується для запиту на відновлення паролю.
export interface INewPasswordAfterForgot extends Pick<IUser, "password"> {} //ISetForgot розширює інтерфейс IUser, але лише з полем password. Це використовується для операцій, пов'язаних з встановленням нового пароля після відновлення.

export interface IActionToken {
  _id?: string;
  actionToken: string;
  tokenType: ActionTokenTypeEnum;
  _userId: string;
}
