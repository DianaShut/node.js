import { CronJob } from "cron";

import { TimeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    console.log("[START CRON] Remove old tokens");
    await tokenRepository.deleteByParams({
      createdAt: { $lte: TimeHelper.subtractByParams(9, "days") },
    }); // в TimeHelper отримуємо число, яке було 9 днів тому(наприклад, якщо сьогодні 10.09, то отримаємо 01.09)
    //$lte - дні, які були раніше або дорівнюють вказаному числу
  } catch (error) {
    console.error("removeOldTokens: ", error);
  } finally {
    console.log("[END CRON] Remove old tokens");
  }
};

export const removeOldTokens = new CronJob("0 0 4 * * *", handler); // Кожного дня о 4:00 виконується функція видалення старих токенів
