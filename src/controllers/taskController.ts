import type { Request, Response, NextFunction } from 'express'
import { addTask, getTasksByProjectId, getTaskById, editTask, removeTask } from '../services/taskService.js'
import { getProjectById } from '../services/projectService.js'

const VALID_STATUSES: readonly string[] = ['todo', 'in-progress', 'done']

function isTaskStatus(value: unknown): value is string {
  return typeof value === 'string' && VALID_STATUSES.includes(value)
}

function parseId(raw: unknown): number | null {
  const id = typeof raw === 'string' ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

function parsePositiveInt(raw: unknown): number | null {
  const id = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

// POST /projects/:id/tasks
export async function createTaskForProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = parseId(req.params.id)
    if (projectId === null) {
      res.status(400).json({ success: false, error: 'project id must be a positive integer' })
      return
    }

    const project = await getProjectById(projectId)
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' })
      return
    }

    const { title, description, status, assignedTo } = req.body ?? {}

    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ success: false, error: 'title is required and must be a non-empty string' })
      return
    }
    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ success: false, error: 'description must be a string' })
      return
    }
    if (status !== undefined && !isTaskStatus(status)) {
      res.status(400).json({ success: false, error: 'status must be one of: todo, in-progress, done' })
      return
    }
    let parsedAssignedTo: number | null = null
    if (assignedTo !== undefined && assignedTo !== null) {
      parsedAssignedTo = parsePositiveInt(assignedTo)
      if (parsedAssignedTo === null) {
        res.status(400).json({ success: false, error: 'assignedTo must be a positive integer' })
        return
      }
    }

    const task = await addTask(title.trim(), description ?? null, status ?? 'todo', projectId, parsedAssignedTo)
    res.status(201).json({ success: true, data: task })
  } catch (error) {
    next(error)
  }
}

// GET /projects/:id/tasks
export async function listTasksForProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = parseId(req.params.id)
    if (projectId === null) {
      res.status(400).json({ success: false, error: 'project id must be a positive integer' })
      return
    }

    const project = await getProjectById(projectId)
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' })
      return
    }

    const tasks = await getTasksByProjectId(projectId)
    res.status(200).json({ success: true, data: tasks })
  } catch (error) {
    next(error)
  }
}

// PATCH /tasks/:id
export async function patchTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }

    const { title, description, status, assignedTo } = req.body ?? {}
    const updates: { title?: string; description?: string | null; status?: string; assignedTo?: number | null } = {}

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ success: false, error: 'title must be a non-empty string' })
        return
      }
      updates.title = title.trim()
    }
    if (description !== undefined) {
      if (typeof description !== 'string') {
        res.status(400).json({ success: false, error: 'description must be a string' })
        return
      }
      updates.description = description
    }
    if (status !== undefined) {
      if (!isTaskStatus(status)) {
        res.status(400).json({ success: false, error: 'status must be one of: todo, in-progress, done' })
        return
      }
      updates.status = status
    }
    if (assignedTo !== undefined) {
      if (assignedTo === null) {
        updates.assignedTo = null
      } else {
        const parsed = parsePositiveInt(assignedTo)
        if (parsed === null) {
          res.status(400).json({ success: false, error: 'assignedTo must be a positive integer or null' })
          return
        }
        updates.assignedTo = parsed
      }
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, error: 'No valid fields to update' })
      return
    }

    const existing = await getTaskById(id)
    if (!existing) {
      res.status(404).json({ success: false, error: 'Task not found' })
      return
    }

    const updated = await editTask(id, updates)
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

// DELETE /tasks/:id
export async function removeTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }
    const deleted = await removeTask(id)
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Task not found' })
      return
    }
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}