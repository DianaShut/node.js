import dayjs, { ManipulateType } from "dayjs"; //ManipulateType - тип, який використовується для визначення одиниць часу (дні, години, хвилини тощо)
import utc from "dayjs/plugin/utc"; //плагін для роботи з часовими зонами UTC (Universal Time Coordinated)

dayjs.extend(utc); //Розширення dayjs плагіном utc

export class TimeHelper {
  public static subtractByParams(value: number, unit: ManipulateType): Date {
    return dayjs().subtract(value, unit).toDate();
  }
}

//value: Параметр, що представляє кількість одиниць часу, які потрібно відняти.
// unit: Параметр типу ManipulateType, який визначає одиницю часу (наприклад, "day", "month", "year").
// dayjs().subtract(value, unit) - віднімає певну кількість часу (value) вказаного типу (unit) від поточної дати і часу і повертає число, яке було декілька днів назад
// toDate(): Перетворює об'єкт dayjs у стандартний об'єкт Date JavaScript
