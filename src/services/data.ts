import type { Task } from '../models/task.js'

export const tasks: Task[] = [
  { id: 1, title: "Set up project repo", description: "Initialize repo and folder structure", status: "done", priority: "high", assignee: "Sam", createdAt: new Date("2026-09-20") },
  { id: 2, title: "Design task schema", description: "Define Task interface and fields", status: "done", priority: "high", assignee: "Sam", createdAt: new Date("2026-09-20") },
  { id: 3, title: "Build Express server", description: "Set up basic Express app", status: "in-progress", priority: "high", assignee: "Alex", createdAt: new Date("2026-09-21") },
  { id: 4, title: "Write task routes", description: "CRUD routes for tasks", status: "in-progress", priority: "medium", assignee: "Alex", createdAt: new Date("2026-09-21") },
  { id: 5, title: "Add input validation", description: "Validate request bodies", status: "todo", priority: "medium", assignee: "Jordan", createdAt: new Date("2026-09-22") },
  { id: 6, title: "Write README", description: "Document setup and usage", status: "todo", priority: "low", assignee: "Sam", createdAt: new Date("2026-09-22") },
  { id: 7, title: "Set up error handling", description: "Centralized error middleware", status: "todo", priority: "high", assignee: "Jordan", createdAt: new Date("2026-09-23") },
  { id: 8, title: "Manual test all endpoints", description: "Test every route manually", status: "todo", priority: "medium", assignee: "Alex", createdAt: new Date("2026-09-23") }
]