import { z } from 'zod'

export const enableTotpSchema = z.object({
  pin: z
    .string('PIN code should be a string')
    .length(6, 'PIN code should be 6 characters long'),
})

export type EnableTotpSchema = z.infer<typeof enableTotpSchema>
