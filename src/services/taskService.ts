import * as taskRepository from '../repositories/taskRepository.js'
import type { TaskRow } from '../repositories/taskRepository.js'

export async function addTask(
  title: string,
  description: string | null,
  status: string,
  projectId: number,
  assignedTo: number | null
): Promise<TaskRow> {
  return taskRepository.createTask(title, description, status, projectId, assignedTo)
}

export async function getTasksByProjectId(projectId: number): Promise<TaskRow[]> {
  return taskRepository.findTasksByProjectId(projectId)
}

export async function getTaskById(id: number): Promise<TaskRow | null> {
  return taskRepository.findTaskById(id)
}

export async function editTask(
  id: number,
  updates: { title?: string; description?: string | null; status?: string; assignedTo?: number | null }
): Promise<TaskRow | null> {
  return taskRepository.updateTask(id, updates)
}

export async function removeTask(id: number): Promise<boolean> {
  return taskRepository.deleteTask(id)
}