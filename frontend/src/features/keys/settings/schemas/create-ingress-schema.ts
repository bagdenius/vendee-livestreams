import { z } from 'zod'

export enum IngressType {
  RTMP = 0,
  WHIP = 1,
}

export const createIngressSchema = z.object({
  ingressType: z.enum(IngressType),
})

export type createIngressInput = z.infer<typeof createIngressSchema>
