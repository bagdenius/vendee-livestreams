import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().min(3).or(z.email()),
  password: z.string().min(8),
  pin: z.string().length(6).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
