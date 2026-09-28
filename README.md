# Backend Foundations


## Project overview
A Task/Project Management REST API, built incrementally over three days: in-memory JavaScript logic (Day 1), converted to TypeScript with typed models (Day 2), and exposed as an Express REST API (Day 3). Data is stored in memory for now; PostgreSQL, authentication, caching and testing are introduced in later phases of this track.

## Technologies used
- Node.js
- TypeScript
- Express
- tsx (development runtime)
- npm

## Prerequisites
- Node.js (LTS recommended)
- npm (bundled with Node.js)
- Git

## Installation
```
git clone https://github.com/Belovedneri/backend-foundations.git
cd backend-foundations
npm install
```

## Environment variables
This project currently uses one optional environment variable:

| Variable | Purpose | Default |
|---|---|---|
| PORT | Port the Express server listens on | 3000 |

No `.env` file is required to run the project as-is. A `.env.example` file is included as a placeholder for when real configuration/secrets are introduced in a later phase. Never commit a real `.env` file - it is already excluded in `.gitignore`.

## Challenges encountered
- **Day 1:** Understanding that JavaScript silently returns `undefined` for a missing object property or array index instead of throwing an error - solved by deliberately testing this in the Node REPL and building the habit of explicit checks (`try/catch`, validation) rather than assuming data is present.
- **Day 2:** Converting untyped JavaScript to TypeScript surfaced places where data shapes weren't as strict as assumed. Solved by defining `TaskStatus`/`TaskPriority` as union types and a `Task` interface, then fixing every compiler error `npx tsc --noEmit` reported until the project compiled cleanly. Also ran a deliberate type-safety challenge (documented below) to see a real compiler error caught before runtime.
- **Day 3:** TypeScript's compile-time checks don't protect against real HTTP requests, since incoming data has no type information. Solved by adding runtime type guards (e.g. `isTaskStatus`) and manual field validation in the controllers, returning `400` for bad input instead of letting invalid data reach the service layer.

## What I can now explain confidently
- The difference between compile-time type checking and runtime behavior.
- How union types and interfaces restrict values vs. object shapes.
- Why `any` removes most of TypeScript's value, and why `unknown` with type guards is safer.
- The request lifecycle: route -> middleware -> controller -> service -> response.
- Why `POST` returns `201` and a successful `GET` returns `200`.
- Why splitting code into routes/controllers/services matters as an app grows.

Foundation of a Task/Project Management REST API - built with Node.js, Express and Typescript.



## Day 2 - TypeScript Backend Foundations

### Setup / Run instructions
This project now uses TypeScript. Source files live in `src/` and compile to `dist/`.

To run in development mode (TypeScript directly, no manual build step):

npm run dev


To build and run the compiled JavaScript (production-style):

npm run build
npm run start


To check for type errors without producing output:

npx tsc --noEmit


### Files
- `types.ts` — `TaskStatus` and `TaskPriority` union types, and the `Task` interface
- `data.ts` — in-memory array of 8 typed task objects (`Task[]`)
- `apiResponse.ts` — a generic `ApiResponse<T>` type used for consistent response shapes
- `taskService.ts` — fully typed versions of add, find, filter, update, delete, and summary functions
- `index.ts` — entry point that runs and prints the result of every function above

### Type-safety challenge
I deliberately assigned an invalid status value (a typo, `"compelted"` instead of a valid
`TaskStatus`) when calling `addTask`. Running `npx tsc --noEmit` caught it immediately,
before the code ever ran:

error TS2322: Type '"compelted"' is not assignable to type 'TaskStatus'.

7 status: "compelted",
~~~~~~

src/types.ts:24:3 - The expected type comes from property 'status' which is declared here on type 'Omit<Task, "createdAt" | "id">'
24 status: TaskStatus
~~~~~~


In plain JavaScript (Day 1), this typo would have been silently accepted — the task would
have been created with a nonsense status, and nothing would have warned me. TypeScript
caught it at compile time, at the exact line, before the program ever ran.

### Learning notes
- TypeScript adds a compile-time type-checking step on top of JavaScript. It does not
  change how the code runs — once compiled, the output is plain JavaScript, and behaves
  identically to hand-written JS (confirmed by running the same logic via `npm run dev`
  and `npm run start` and getting identical output).
- A union type (e.g. `TaskStatus = "todo" | "in-progress" | "done"`) restricts a single
  value to a fixed set of options, catching typos immediately.
- An interface (e.g. `Task`) restricts the shape of an entire object — every required
  field and its type — catching missing or wrong-typed fields immediately.
- Utility types like `Omit<Task, 'id' | 'createdAt'>` and `Partial<Task>` let you derive
  new types from an existing one instead of duplicating field lists.
- Generics (e.g. `ApiResponse<T>`) let one type definition work for many different kinds
  of data, instead of writing a separate type for every case.
- Types only exist at compile time — they are completely stripped out of the final
  compiled JavaScript (confirmed by inspecting `dist/index.js`, which contains no type
  annotations at all).
- Avoiding `any` matters because it turns off type checking entirely for that value,
  defeating the purpose of using TypeScript in the first place — errors that should be
  caught at compile time would slip through to runtime instead, exactly like plain JS.
- `npm run build` runs the TypeScript compiler (`tsc`), which type-checks every file and
  writes compiled, plain JavaScript into `dist/`. `npm run start` then runs that compiled
  output directly with Node — no TypeScript involved at that point. This is why production
  systems run compiled JavaScript rather than TypeScript directly: the checking already
  happened once, during the build.


  
## Day 3 - Node.js, HTTP & Express REST API

### Install and run
```
npm install
npm run dev
```
The server starts on http://localhost:3000. To use another port in PowerShell:
```
$env:PORT=4000; npm run dev
```

### Build and start (production style)
```
npm run build
npm run start
```
`build` compiles TypeScript from `src/` into JavaScript in `dist/`. `start` runs the compiled `dist/server.js` with plain Node.

### Endpoints
| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| GET | /health | Health check | 200 |
| GET | /tasks | List tasks (optional `?status=todo`) | 200 |
| GET | /tasks/:id | Get one task | 200 / 404 |
| POST | /tasks | Create a task | 201 |
| PATCH | /tasks/:id | Update a task | 200 / 404 |
| DELETE | /tasks/:id | Delete a task | 204 / 404 |

Invalid input returns 400. Unknown routes return 404. Unexpected errors return 500 with a generic message (internal details are logged on the server, never sent to the client).

Example - create a task:
```
POST /tasks
Content-Type: application/json

{ "title": "Write API docs", "assignee": "Sam", "priority": "high" }
```
Response (201):
```
{ "success": true, "data": { "id": 9, "title": "Write API docs", "status": "todo", ... } }
```

### Testing
All requests are saved in `requests.http` (VS Code REST Client extension). Each request has a comment with its expected status code.

### Project structure
- `src/app.ts` - creates the Express app, registers middleware and routes
- `src/server.ts` - starts the server on `process.env.PORT` (fallback 3000)
- `src/routes/` - maps URLs and methods to controller functions
- `src/controllers/` - handles HTTP: reads input, validates it, chooses status codes
- `src/services/` - task logic and in-memory data, with no HTTP code
- `src/models/` - the Task types
- `src/middleware/` - request logger and error handler

### Learning notes
- Request flow: HTTP request -> logger middleware -> express.json() -> route -> controller -> service -> response.
- `express.json()` parses JSON request bodies. Without it, `req.body` is undefined.
- POST returns 201 (a new resource was created); a successful GET returns 200.
- Types only exist at compile time, so the controller uses runtime checks (type guards) on the incoming request data.
- Keeping everything in one file would make it hard to find, test and change code as the app grows. Separate layers give each piece one job.