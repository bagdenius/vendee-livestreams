import { z } from 'zod'

export const createPlanSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
})

export type CreatePlanInput = z.infer<typeof createPlanSchema>
