import * as projectRepository from '../repositories/projectRepository.js'
import type { ProjectRow } from '../repositories/projectRepository.js'

export async function addProject(name: string, description: string | null, ownerId: number): Promise<ProjectRow> {
  return projectRepository.createProject(name, description, ownerId)
}

export async function getAllProjects(): Promise<ProjectRow[]> {
  return projectRepository.findAllProjects()
}

export async function getProjectById(id: number): Promise<ProjectRow | null> {
  return projectRepository.findProjectById(id)
}

export async function editProject(id: number, updates: { name?: string; description?: string | null }): Promise<ProjectRow | null> {
  return projectRepository.updateProject(id, updates)
}

export async function removeProject(id: number): Promise<boolean> {
  return projectRepository.deleteProject(id)
}