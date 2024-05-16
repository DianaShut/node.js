import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.signUp,
);
router.post(
  "/sign-in",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.signIn,
);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post(
  "/forgot-password", //маршрут для відправлення запиту на відновлення пароля
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  authController.forgotPassword,
);
router.put(
  "/forgot-password", //маршрут для встановлення нового пароля після відновлення
  commonMiddleware.isBodyValid(UserValidator.newPasswordAfterForgot),
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT),
  authController.newPasswordAfterForgot,
);

router.put(
  "/verify", //маршрут для верифікації користувача
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY),
  authController.verify,
);

router.patch(
  "/change-password",
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword,
);

export const authRouter = router;
