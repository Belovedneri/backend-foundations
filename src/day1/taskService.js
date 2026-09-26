// taskService.js
// This file contains all the FUNCTIONS that operate on our task data.
// We keep this separate from data.js on purpose: data.js just holds the
// data itself, while this file holds the logic/behavior. This separation
// is the same idea as splitting routes/controllers/repositories that we'll
// use once we build the real Express API in the coming days.

import tasks from './data.js'

// --- ADD A TASK ---
// Takes a new task object (without an id) and adds it to the tasks array.
// We calculate the next id ourselves, based on the highest existing id + 1.
function addTask(newTask) {
  const nextId = tasks.length > 0
    ? Math.max(...tasks.map(task => task.id)) + 1
    : 1

  const taskToAdd = { id: nextId, ...newTask }
  tasks.push(taskToAdd)
  return taskToAdd
}

// --- FIND A TASK BY ID ---
// Uses .find(), which returns the FIRST matching item, or undefined
// if nothing matches (remember: this doesn't throw an error automatically).
function findTaskById(id) {
  return tasks.find(task => task.id === id)
}

// --- FILTER TASKS BY STATUS ---
// Uses .filter(), which returns a NEW array containing only tasks
// whose status matches what was asked for.
function filterByStatus(status) {
  return tasks.filter(task => task.status === status)
}

// --- UPDATE A TASK ---
// Finds the task by id, and if it exists, merges in the new fields
// using spread syntax (this does NOT mutate the original object directly,
// it builds a new merged object and replaces it in the array).
function updateTask(id, updates) {
  const index = tasks.findIndex(task => task.id === id)

  if (index === -1) {
    // We deliberately throw an error here so calling code can catch it.
    // This satisfies exercise 6: "intentionally throw an error for a missing task."
    throw new Error(`Task with id ${id} not found`)
  }

  const updatedTask = { ...tasks[index], ...updates }
  tasks[index] = updatedTask
  return updatedTask
}

// --- DELETE A TASK ---
// Removes a task from the array by id. Returns true if something was
// deleted, false if no task with that id existed.
function deleteTask(id) {
  const index = tasks.findIndex(task => task.id === id)

  if (index === -1) {
    return false
  }

  tasks.splice(index, 1)
  return true
}

// --- SUMMARY FUNCTION ---
// Returns total task count, and a breakdown of how many tasks
// exist per status (todo / in-progress / done), using reduce().
function getSummary() {
  const total = tasks.length

  const countsByStatus = tasks.reduce((counts, task) => {
    counts[task.status] = (counts[task.status] || 0) + 1
    return counts
  }, {})

  return { total, countsByStatus }
}

export {
  addTask,
  findTaskById,
  filterByStatus,
  updateTask,
  deleteTask,
  getSummary
}