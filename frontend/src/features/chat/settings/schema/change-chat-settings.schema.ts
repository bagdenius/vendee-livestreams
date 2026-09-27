import { z } from 'zod'

export const changeChatSettingsSchema = z.object({
  isChatEnabled: z.boolean(),
  isChatFollowersOnly: z.boolean(),
  isChatSponsorsOnly: z.boolean(),
})

export type ChangeChatSettingsInput = z.infer<typeof changeChatSettingsSchema>
