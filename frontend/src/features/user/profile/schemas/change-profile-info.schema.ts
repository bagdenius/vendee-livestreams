import { z } from 'zod'

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/

export const changeProfileInfoSchema = z.object({
  username: z
    .string('Username should be a string')
    .min(3, 'Username should be at least 3 characters')
    .max(20, 'Username should be at most 20 characters')
    .regex(
      USERNAME_REGEX,
      'Username should start with a letter and contain only letters, numbers and underscores',
    ),
  displayName: z
    .string('Display name should be a string')
    .min(2, 'Display name should be at least 2 characters'),
  bio: z
    .string('Bio name should be a string')
    .max(300, 'Bio should be less than 300 characters long'),
})

export type ChangeProfileInfoSchema = z.infer<typeof changeProfileInfoSchema>
