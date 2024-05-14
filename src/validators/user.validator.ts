import joi from "joi";

import { regexConstants } from "../constants/regex.constants";

export class UserValidator {
  private static userName = joi.string().min(3).max(50).trim().messages({
    "string.empty": "{{#label}} not be empty",
    "string.max":
      "{{#label}} length must be less than or equal to {{#limit}} characters long2",
    "string.min":
      "{{#label}} length must be at least {{#limit}} characters long2",
  });

  private static phone = joi.string().regex(regexConstants.PHONE).trim();
  private static age = joi.number().min(18).max(100);
  private static email = joi
    .string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim();
  private static password = joi.string().regex(regexConstants.PASSWORD).trim();

  public static create = joi.object({
    name: this.userName.required(),
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone,
    age: this.age,
  });

  public static update = joi.object({
    name: this.userName,
    phone: this.phone,
    age: this.age,
  });

  public static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  public static forgotPassword = joi.object({
    email: this.email.required(),
  });

  public static changePassword = joi.object({
    password: this.password.required(),
  });
}
