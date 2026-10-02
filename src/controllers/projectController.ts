import type { Request, Response, NextFunction } from 'express'
import { addProject, getAllProjects, getProjectById, editProject, removeProject } from '../services/projectService.js'

function parseId(raw: unknown): number | null {
  const id = typeof raw === 'string' ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

function parsePositiveInt(raw: unknown): number | null {
  const id = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, ownerId } = req.body ?? {}

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ success: false, error: 'name is required and must be a non-empty string' })
      return
    }
    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ success: false, error: 'description must be a string' })
      return
    }
    const parsedOwnerId = parsePositiveInt(ownerId)
    if (parsedOwnerId === null) {
      res.status(400).json({ success: false, error: 'ownerId is required and must be a positive integer' })
      return
    }

    const project = await addProject(name.trim(), description ?? null, parsedOwnerId)
    res.status(201).json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

export async function listProjects(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await getAllProjects()
    res.status(200).json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }
    const project = await getProjectById(id)
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' })
      return
    }
    res.status(200).json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

export async function patchProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }

    const { name, description } = req.body ?? {}
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      res.status(400).json({ success: false, error: 'name must be a non-empty string' })
      return
    }
    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ success: false, error: 'description must be a string' })
      return
    }

    const updated = await editProject(id, { name, description })
    if (!updated) {
      res.status(404).json({ success: false, error: 'Project not found' })
      return
    }
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

export async function removeProjectHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }
    const deleted = await removeProject(id)
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Project not found' })
      return
    }
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}