// Type: EmailCombinedPayloadType для передачі даних в шаблон email-повідомлення
export type EmailCombinedPayloadType = {
  name?: string;
  frontUrl?: string;
  actionToken?: string; // actionToken - це токен, який використовується для підтвердження email-у
};
