import { z } from 'zod'

export const changePasswordSchema = z.object({
  oldPassword: z
    .string('Password should be a string')
    .min(8, 'Password should be at least 8 characters'),
  newPassword: z
    .string('Password should be a string')
    .min(8, 'Password should be at least 8 characters'),
})

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
