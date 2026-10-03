import { z } from 'zod'

const TASK_STATUSES = ['todo', 'in-progress', 'done'] as const

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(200, 'title must be 200 characters or fewer'),
  description: z.string().max(2000, 'description must be 2000 characters or fewer').optional(),
  status: z.enum(TASK_STATUSES, { message: 'status must be one of: todo, in-progress, done' }).optional(),
  assignedTo: z.number().int().positive('assignedTo must be a positive integer').nullable().optional()
})

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'title must be a non-empty string').max(200, 'title must be 200 characters or fewer').optional(),
  description: z.string().max(2000, 'description must be 2000 characters or fewer').optional(),
  status: z.enum(TASK_STATUSES, { message: 'status must be one of: todo, in-progress, done' }).optional(),
  assignedTo: z.number().int().positive('assignedTo must be a positive integer').nullable().optional()
})