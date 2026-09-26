# Backend Foundations

## Day 1 - JavaScript Backend Foundations

### Setup / Run instructions
This project uses ES Modules (`"type": "module"` in package.json).

To run the Day 1 exercises:

cd src/day1
node index.js


This runs `index.js`, which imports and demonstrates all Day 1 functionality:
adding, finding, filtering, updating and deleting tasks, a summary function,
and an async task lookup (success and failure) with error handling.

### Files
- `data.js` — in-memory array of 8 task objects (id, title, status, priority, assignee)
- `taskService.js` — functions to add, find, filter, update, delete tasks, and get a summary
- `asyncDemo.js` — simulates an async task lookup using a Promise + setTimeout, demonstrates async/await and try/catch
- `index.js` — entry point that runs and prints the result of every function above

### Learning notes
- `const` vs `let`: `const` prevents reassignment, which helps catch accidental
  bugs early since JavaScript throws a `TypeError` if you try to reassign it.
- Accessing a missing object property or array index does NOT throw an error —
  it silently returns `undefined`. This is why deliberate validation and
  error handling matters in backend code.
- `map`/`filter` return new arrays and never modify the original array or object.
  This "don't mutate, create a copy" pattern (also used with spread syntax) makes
  code easier to reason about.
- `async`/`await` is built on top of Promises — `await` pauses just that function
  until the Promise resolves, without freezing the rest of the program.
- `try/catch` is essential for async backend code: without it, one failed
  operation (like a missing task) could crash the whole server instead of
  just failing gracefully for that one request.
- Modules (`import`/`export`) let code be split across files logically
  (data vs logic vs entry point) instead of one large file.