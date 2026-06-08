import { z } from 'zod'

export const resetPasswordSchema = z.object({ email: z.email() })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
