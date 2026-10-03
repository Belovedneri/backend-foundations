import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/authenticate.js'
import { addProject, getAllProjects, getProjectById, editProject, removeProject } from '../services/projectService.js'

function parseId(raw: unknown): number | null {
  const id = typeof raw === 'string' ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function createProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description } = req.body ?? {}

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ success: false, error: 'name is required and must be a non-empty string' })
      return
    }
    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ success: false, error: 'description must be a string' })
      return
    }

    // The owner is ALWAYS the authenticated user - never trust a client-supplied ownerId
    const ownerId = req.user!.userId

    const project = await addProject(name.trim(), description ?? null, ownerId)
    res.status(201).json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

export async function listProjects(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await getAllProjects()
    res.status(200).json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
}

export async function getProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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

export async function patchProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }

    const existing = await getProjectById(id)
    if (!existing) {
      res.status(404).json({ success: false, error: 'Project not found' })
      return
    }

    // Ownership check: only the owner (or an admin) may update this project
    if (existing.owner_id !== req.user!.userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, error: 'You do not have permission to update this project' })
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
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

export async function removeProjectHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id)
    if (id === null) {
      res.status(400).json({ success: false, error: 'id must be a positive integer' })
      return
    }

    const existing = await getProjectById(id)
    if (!existing) {
      res.status(404).json({ success: false, error: 'Project not found' })
      return
    }

    // Ownership check: only the owner (or an admin) may delete this project
    if (existing.owner_id !== req.user!.userId && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, error: 'You do not have permission to delete this project' })
      return
    }

    await removeProject(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}