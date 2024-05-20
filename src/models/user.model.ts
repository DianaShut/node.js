import * as mongoose from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    age: { type: Number, required: false },
    role: { type: String, enum: RoleEnum, default: RoleEnum.USER }, //Створюємо поле role, яке приймає значення з перерахування RoleEnum
    isDeleted: { type: Boolean, default: false },
    avatar: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, //Створюємо поля createdAt та updatedAt для відстеження дати створення та останнього оновлення запису
    versionKey: false, //Вимикаємо поле __v, яке містить версію запису
  },
);

export const User = mongoose.model<IUser>("users", userSchema); //Створюємо модель користувача
