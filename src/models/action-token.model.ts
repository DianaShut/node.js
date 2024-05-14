import mongoose, { Types } from "mongoose";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IActionToken } from "../interfaces/action-token.interface";
import { User } from "./user.model";

// Цей код визначає схему для моделі ActionToken, яка використовується для зберігання даних про токени дій.
const tokenSchema = new mongoose.Schema(
  {
    actionToken: { type: String, required: true },
    tokenType: { type: String, required: true, enum: ActionTokenTypeEnum },

    _userId: { type: Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true, // Додає поля createdAt та updatedAt
    versionKey: false, // Відключає поле __v
  },
);

export const ActionToken = mongoose.model<IActionToken>(
  "action-tokens",
  tokenSchema,
);
