import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/authenticate.js'
import { addTask, getTasksByProjectId, getTaskById, editTask, removeTask } from '../services/taskService.js'
import { getProjectById } from '../services/projectService.js'

function parseId(raw: unknown): number | null {
  const id = typeof raw === 'string' ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function createTaskForProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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

    if (project.owner_id !== req.user!.userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Only the project owner may add tasks to this project' })
      return
    }

    const { title, description, status, assignedTo } = req.body
    const task = await addTask(title, description ?? null, status ?? 'todo', projectId, assignedTo ?? null)
    res.status(201).json({ success: true, data: task })
  } catch (error) {
    next(error)
  }
}

export async function listTasksForProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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

export async function patchTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }

    const existing = await getTaskById(id)
    if (!existing) {
      res.status(404).json({ success: false, error: 'Task not found' })
      return
    }

    const project = await getProjectById(existing.project_id)
    if (!project || (project.owner_id !== req.user!.userId && req.user!.role !== 'admin')) {
      res.status(403).json({ success: false, error: 'You do not have permission to update this task' })
      return
    }

    const updated = await editTask(id, req.body)
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

export async function removeTaskHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }

    const existing = await getTaskById(id)
    if (!existing) {
      res.status(404).json({ success: false, error: 'Task not found' })
      return
    }

    const project = await getProjectById(existing.project_id)
    if (!project || (project.owner_id !== req.user!.userId && req.user!.role !== 'admin')) {
      res.status(403).json({ success: false, error: 'You do not have permission to delete this task' })
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