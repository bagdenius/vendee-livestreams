import { z } from 'zod'

export const deactivationSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8),
  pin: z.string().length(6).optional(),
})

export type DeactivationInput = z.infer<typeof deactivationSchema>
