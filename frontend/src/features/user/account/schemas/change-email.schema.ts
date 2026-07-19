import { z } from 'zod'

export const changeEmailSchema = z.object({
  email: z.email('Invalid email format'),
})

export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>
