// data.js
// This file holds our in-memory "database" of tasks.
// Since we don't have a real database yet (that comes later in the course),
// we just store everything in a plain JavaScript array that lives in memory.
// This means: every time the program restarts, this data resets back to these
// 8 starting tasks. That's expected and fine for Days 1-3.

const tasks = [
  { id: 1, title: "Set up project repo", status: "done", priority: "high", assignee: "Sam" },
  { id: 2, title: "Design task schema", status: "done", priority: "high", assignee: "Sam" },
  { id: 3, title: "Build Express server", status: "in-progress", priority: "high", assignee: "Alex" },
  { id: 4, title: "Write task routes", status: "in-progress", priority: "medium", assignee: "Alex" },
  { id: 5, title: "Add input validation", status: "todo", priority: "medium", assignee: "Jordan" },
  { id: 6, title: "Write README", status: "todo", priority: "low", assignee: "Sam" },
  { id: 7, title: "Set up error handling", status: "todo", priority: "high", assignee: "Jordan" },
  { id: 8, title: "Manual test all endpoints", status: "todo", priority: "medium", assignee: "Alex" }
]

// We "export" the tasks array so other files (like taskService.js) can
// import it and work with this data. Without exporting, this array would
// only exist inside data.js and nothing else could use it — remember the
// scope rules from earlier: a variable is only visible where it's declared,
// unless we deliberately open a "door" out of the file using export.
export default tasks