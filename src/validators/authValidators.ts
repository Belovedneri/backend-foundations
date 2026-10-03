import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'name is required and must be a non-empty string'),
  email: z.string().trim().toLowerCase().email('email must be a valid email address'),
  password: z.string().min(8, 'password must be at least 8 characters')
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'email is required'),
  password: z.string().min(1, 'password is required')
})