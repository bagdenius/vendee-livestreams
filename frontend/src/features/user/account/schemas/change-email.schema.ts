import { z } from 'zod'

export const changeEmailSchema = z.object({
  email: z.email('Invalid email format'),
})

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>
