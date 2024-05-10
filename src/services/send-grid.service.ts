import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
//MailDataRequired - це TS тип, який використовується для вказівки необхідної структури даних для відправлення листів через SendGrid
import SendGrid from "@sendgrid/mail"; //SendGrid - це основний клас для взаємодії з SendGrid API. Цей клас містить методи для відправлення листів, керування шаблонами, керування адресами електронної пошти та інші

import { config } from "../configs/config";
import { emailTemplateConstant } from "../constants/email-template.constants"; //зберігає ідентифікатори шаблонів для різних типів email-ів
import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailTypeToPayloadType } from "../types/email-type-to-payload.type"; //використовуються для типізації і визначення відповідності між типами email-ів і даними, які вони вимагають

class SendGridService {
  constructor() {
    SendGrid.setApiKey(config.SENDGRID_API_KEY);
  } //Конструктор класу ініціалізує клієнт SendGrid, встановлюючи API ключ

  // Загальнодоступний асинхронний метод, який параметризований типом T, що є підтипом перелічення EmailTypeEnum. Цей метод приймає адресу отримувача, тип email-у та дані, які використовуються для заповнення шаблону
  public async sendByType<T extends EmailTypeEnum>(
    to: string, // to - це адреса отримувача
    type: T, // type - це тип email-у
    dynamicTemplateData: EmailTypeToPayloadType[T], //  це дані, які використовуються для заповнення шаблону
  ): Promise<void> {
    try {
      //Отримує ID шаблону з константи, що визначає шаблони для різних типів листів
      const templateId = emailTemplateConstant[type].templateId;
      //Викликає метод send, який відправляє листа
      await this.send({
        from: config.SENDGRID_FROM_EMAIL,
        to,
        templateId,
        dynamicTemplateData,
      });
    } catch (error) {
      console.error("Error email: ", error);
    }
  }

  //Приватний метод send: Призначений для власне відправлення листа через SendGrid, приймає параметр email, що містить всі необхідні дані для листа.
  private async send(email: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(email);
    } catch (error) {
      console.error("Error email: ", error);
    }
  }
}

export const sendGridService = new SendGridService();
