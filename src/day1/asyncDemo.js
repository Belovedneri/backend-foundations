// asyncDemo.js
// This file demonstrates asynchronous JavaScript: Promises, async/await,
// and try/catch error handling — simulating what a real database call
// would feel like (a delay before you get your data back), even though
// we don't have a real database yet.

import { findTaskById } from './taskService.js'

// --- SIMULATED ASYNC FETCH ---
// This function pretends to "fetch" a task from somewhere slow (like a
// database or another server), by wrapping the lookup in a Promise and
// adding an artificial delay using setTimeout. In a real backend, this
// exact shape (a Promise that resolves or rejects after some work) is
// what database calls and network requests actually look like.
function fetchTaskById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = findTaskById(id)

      if (task) {
        resolve(task)
      } else {
        // reject() is how a Promise signals failure. Whatever we pass here
        // becomes the "error" that a catch block receives.
        reject(new Error(`Task with id ${id} not found`))
      }
    }, 500) // 500ms delay, just to simulate a slow operation
  })
}

// --- USING THE ASYNC FUNCTION WITH try/catch ---
// This function shows the pattern you'll use constantly in Express routes:
// await something async, and wrap it in try/catch so a failure doesn't
// crash the whole program.
async function demoFetchExistingTask() {
  try {
    const task = await fetchTaskById(3)
    console.log('Fetched task:', task)
  } catch (error) {
    console.log('Error fetching task:', error.message)
  }
}

async function demoFetchMissingTask() {
  try {
    const task = await fetchTaskById(999) // this id doesn't exist on purpose
    console.log('Fetched task:', task)
  } catch (error) {
    console.log('Error fetching task:', error.message)
  }
}

export { fetchTaskById, demoFetchExistingTask, demoFetchMissingTask }