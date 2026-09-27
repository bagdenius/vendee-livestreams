import { z } from 'zod'

export const changeNotificationSettingsSchema = z.object({
  siteNotifications: z.boolean(),
  telegramNotifications: z.boolean(),
})

export type ChangeNotificationSettingsSchema = z.infer<
  typeof changeNotificationSettingsSchema
>
