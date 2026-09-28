import type { Task, TaskStatus } from '../models/task.js'
import { tasks } from './data.js'
import type { ApiResponse } from '../models/apiResponse.js'

// --- ADD A TASK ---
// Omit<Task, 'id' | 'createdAt'> means: "a Task, but WITHOUT the id and
// createdAt fields" — since this function calculates those itself, the
// caller shouldn't have to (or be allowed to) provide them.
export function addTask(newTask: Omit<Task, 'id' | 'createdAt'>): Task {
  const nextId = tasks.length > 0
    ? Math.max(...tasks.map(task => task.id)) + 1
    : 1

  const taskToAdd: Task = { id: nextId, createdAt: new Date(), ...newTask }
  tasks.push(taskToAdd)
  return taskToAdd
}

// --- FIND A TASK BY ID ---
// Return type "Task | undefined" is explicit and honest: this function
// might not find anything, and TypeScript forces callers to handle that
// possibility instead of assuming a Task always comes back.
export function findTaskById(id: number): Task | undefined {
  return tasks.find(task => task.id === id)
}

// --- FILTER TASKS BY STATUS ---
// status must be a real TaskStatus — not just any string — so a typo
// like "completd" is caught immediately, before the code ever runs.
export function filterByStatus(status: TaskStatus): Task[] {
  return tasks.filter(task => task.status === status)
}

// --- UPDATE A TASK ---
// Partial<Task> means "some subset of Task's fields, all optional" —
// since an update might only change one or two fields, not all seven.
export function updateTask(id: number, updates: Partial<Task>): Task {
  const index = tasks.findIndex(task => task.id === id)

  if (index === -1) {
    throw new Error(`Task with id ${id} not found`)
  }

  const existingTask = tasks[index] as Task
  const updatedTask: Task = { ...existingTask, ...updates }
  tasks[index] = updatedTask
  return updatedTask
}

// --- DELETE A TASK ---
export function deleteTask(id: number): boolean {
  const index = tasks.findIndex(task => task.id === id)
  if (index === -1) return false
  tasks.splice(index, 1)
  return true
}

// --- SUMMARY FUNCTION ---
// Uses the generic ApiResponse<T> from apiResponse.ts, with T filled in
// as an object containing a total count and a breakdown by status.
export function getSummary(): ApiResponse<{ total: number; countsByStatus: Record<string, number> }> {
  const total = tasks.length
  const countsByStatus = tasks.reduce((counts, task) => {
    counts[task.status] = (counts[task.status] || 0) + 1
    return counts
  }, {} as Record<string, number>)

  return { success: true, data: { total, countsByStatus } }
}