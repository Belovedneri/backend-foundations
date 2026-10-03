import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'name is required').max(150, 'name must be 150 characters or fewer'),
  description: z.string().max(2000, 'description must be 2000 characters or fewer').optional()
})

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, 'name must be a non-empty string').max(150, 'name must be 150 characters or fewer').optional(),
  description: z.string().max(2000, 'description must be 2000 characters or fewer').optional()
})