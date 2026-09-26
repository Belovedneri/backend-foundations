// index.js
// This is the entry point — the file we actually run with `node`.
// It imports everything from our other modules and calls each function,
// printing results so we can see and verify our code works correctly.

import { addTask, findTaskById, filterByStatus, updateTask, deleteTask, getSummary } from './taskService.js'
import { demoFetchExistingTask, demoFetchMissingTask } from './asyncDemo.js'

console.log('--- Summary before changes ---')
console.log(getSummary())

console.log('\n--- Adding a new task ---')
const newTask = addTask({ title: 'Deploy to production', status: 'todo', priority: 'high', assignee: 'Sam' })
console.log('Added:', newTask)

console.log('\n--- Finding task by id (id: 3) ---')
console.log(findTaskById(3))

console.log('\n--- Filtering tasks by status: "todo" ---')
console.log(filterByStatus('todo'))

console.log('\n--- Updating task id: 4 ---')
const updated = updateTask(4, { status: 'done' })
console.log('Updated:', updated)

console.log('\n--- Deleting task id: 6 ---')
const wasDeleted = deleteTask(6)
console.log('Was deleted:', wasDeleted)

console.log('\n--- Summary after changes ---')
console.log(getSummary())

console.log('\n--- Intentionally trying to update a MISSING task (id: 999) ---')
try {
  updateTask(999, { status: 'done' })
} catch (error) {
  console.log('Caught error:', error.message)
}

// Run the async demos last, since they involve a delay
console.log('\n--- Async demo: fetching an existing task ---')
await demoFetchExistingTask()

console.log('\n--- Async demo: fetching a MISSING task ---')
await demoFetchMissingTask()