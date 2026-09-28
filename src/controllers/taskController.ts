import type { Request, Response, NextFunction } from 'express'
import type { Task, TaskStatus, TaskPriority } from '../models/task.js'
import { addTask, deleteTask, filterByStatus, findTaskById, getAllTasks, updateTask } from '../services/taskService.js'

const VALID_STATUSES: readonly string[] = ['todo', 'in-progress', 'done']
const VALID_PRIORITIES: readonly string[] = ['low', 'medium', 'high']

// Types vanish at runtime, so we need real runtime checks (type guards).
function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && VALID_STATUSES.includes(value)
}

function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === 'string' && VALID_PRIORITIES.includes(value)
}

function parseId(raw: unknown): number | null {
  const id = typeof raw === 'string' ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

export function listTasks(req: Request, res: Response): void {
  const status = req.query.status
  if (status === undefined) {
    res.status(200).json({ success: true, data: getAllTasks() })
    return
  }
  if (!isTaskStatus(status)) {
    res.status(400).json({ success: false, error: 'status must be one of: todo, in-progress, done' })
    return
  }
  res.status(200).json({ success: true, data: filterByStatus(status) })
}

export function getTask(req: Request, res: Response): void {
  const id = parseId(req.params.id)
  if (id === null) {
    res.status(400).json({ success: false, error: 'id must be a positive integer' })
    return
  }
  const task = findTaskById(id)
  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' })
    return
  }
  res.status(200).json({ success: true, data: task })
}

export function createTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description, status, priority, assignee } = req.body ?? {}

    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ success: false, error: 'title is required and must be a non-empty string' })
      return
    }
    if (typeof assignee !== 'string' || assignee.trim() === '') {
      res.status(400).json({ success: false, error: 'assignee is required and must be a non-empty string' })
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
    if (priority !== undefined && !isTaskPriority(priority)) {
      res.status(400).json({ success: false, error: 'priority must be one of: low, medium, high' })
      return
    }

    const task = addTask({
      title: title.trim(),
      description: description ?? '',
      status: status ?? 'todo',
      priority: priority ?? 'medium',
      assignee: assignee.trim()
    })
    res.status(201).json({ success: true, data: task })
  } catch (error) {
    next(error)
  }
}

export function patchTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }
    if (!findTaskById(id)) {
      res.status(404).json({ success: false, error: 'Task not found' })
      return
    }

    const { title, description, status, priority, assignee } = req.body ?? {}
    const updates: Partial<Task> = {}

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
    if (priority !== undefined) {
      if (!isTaskPriority(priority)) {
        res.status(400).json({ success: false, error: 'priority must be one of: low, medium, high' })
        return
      }
      updates.priority = priority
    }
    if (assignee !== undefined) {
      if (typeof assignee !== 'string' || assignee.trim() === '') {
        res.status(400).json({ success: false, error: 'assignee must be a non-empty string' })
        return
      }
      updates.assignee = assignee.trim()
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, error: 'No valid fields to update' })
      return
    }

    const updated = updateTask(id, updates)
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

export function removeTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }
    if (!deleteTask(id)) {
      res.status(404).json({ success: false, error: 'Task not found' })
      return
    }
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}