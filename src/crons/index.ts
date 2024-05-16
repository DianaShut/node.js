import { notifyOldVisitors } from "./notification-old-visitor.cron";
import { removeOldTokens } from "./remove-old-tokens.cron";

export const runCronJobs = () => {
  removeOldTokens.start();
  notifyOldVisitors.start();
};
