import { addTask, findTaskById, filterByStatus, updateTask, deleteTask, getSummary } from './taskService.js'

console.log('--- Summary before changes ---')
console.log(getSummary())

console.log('\n--- Adding a new task ---')
const newTask = addTask({
  title: 'Deploy to production',
  description: 'Ship the API to the production server',
  status: 'todo',
  priority: 'high',
  assignee: 'Sam'
})
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
  if (error instanceof Error) {
    console.log('Caught error:', error.message)
  }
}