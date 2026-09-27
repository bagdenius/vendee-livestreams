import { z } from 'zod'

export const changeThemeSchema = z.object({
  theme: z.enum(['light', 'dark']),
})

export type ChangeThemeInput = z.infer<typeof changeThemeSchema>
