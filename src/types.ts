// types.ts
// This file defines the "shapes" of our data using TypeScript types.
// Unlike Day 1's data.js, nothing here actually stores data — this file
// only describes what a valid Task is SUPPOSED to look like. TypeScript
// uses this to check every other file that creates or uses a Task.

// A union type: TaskStatus can ONLY ever be one of these three exact
// strings. If you try to assign anything else (e.g. "finished"), TypeScript
// will refuse to compile. This is the "string-union alternative to enums"
// mentioned in the assignment — simpler than an enum, but gives the same
// safety for a fixed set of allowed values.
export type TaskStatus = "todo" | "in-progress" | "done"

// Same idea, for priority.
export type TaskPriority = "low" | "medium" | "high"

// An interface describes the SHAPE of an object: exactly which fields
// it must have, and what type each field must be. Any object claiming
// to be a "Task" must match this shape exactly (or TypeScript errors).
export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  createdAt: Date
}