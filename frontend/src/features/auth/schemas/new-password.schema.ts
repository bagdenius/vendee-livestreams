import { z } from 'zod'

export const newPasswordSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordRepeat'],
    error: 'Passwords should match',
  })

export type NewPasswordInput = z.infer<typeof newPasswordSchema>
