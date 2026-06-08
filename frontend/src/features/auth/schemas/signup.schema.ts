import { z } from 'zod'

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/

export const signupSchema = z.object({
  username: z
    .string('Username should be a string')
    .min(3, 'Username should be at least 3 characters')
    .max(20, 'Username should be at most 20 characters')
    .regex(
      USERNAME_REGEX,
      'Username should start with a letter and contain only letters, numbers and underscores',
    ),
  email: z.email('Invalid email format'),
  password: z
    .string('Password should be a string')
    .min(8, 'Password should be at least 8 characters'),
})

export type SignupInput = z.infer<typeof signupSchema>
