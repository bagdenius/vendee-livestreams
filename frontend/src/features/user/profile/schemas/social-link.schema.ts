import { z } from 'zod'

export const socialLinkSchema = z.object({
  title: z.string('Title should be a string'),
  url: z.url('URL should be in https://host.domain format'),
})

export type SocialLinkSchema = z.infer<typeof socialLinkSchema>
