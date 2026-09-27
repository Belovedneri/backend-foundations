import type { Task } from './types.js'

const myTask: Task = {
  id: 1,
  title: "Buy milk",
  description: "Get 2% milk from the store",
  status: "todo",
  priority: "medium",
  assignee: "Sam",
  createdAt: new Date()
}

console.log(myTask)