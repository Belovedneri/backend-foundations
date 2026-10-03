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


## Day 4 - PostgreSQL and SQL Fundamentals

### Database setup
1. Install PostgreSQL locally (includes the `psql` command-line client).
2. Create the database:
```
createdb -U postgres backend_internship
```
3. Run the schema and seed files:
```
psql -U postgres -d backend_internship -f database/schema.sql
psql -U postgres -d backend_internship -f database/seed.sql
```
4. Connect and explore:
```
psql -U postgres -d backend_internship
```

### Files
- `database/schema.sql` - creates the `users`, `projects` and `tasks` tables, their constraints, and one index
- `database/seed.sql` - inserts 5 users, 3 projects and 12 tasks for testing
- `database/queries.sql` - practice queries covering SELECT, WHERE, JOIN, UPDATE, pagination and an aggregate

### Why the data moved out of JavaScript arrays
In Days 1-3, all task data lived in a plain array in memory. Restarting the server wiped out anything added at runtime, because the array only existed in RAM while the process was running. PostgreSQL stores data on disk, in a separate process, so the data survives a server restart, a crash, or a full computer reboot. I confirmed this directly: after inserting 12 tasks, disconnecting from `psql` completely, and reconnecting fresh, all 12 tasks were still there.

### Key concepts
**Primary key vs foreign key:** A primary key (`id` in each table) is the unique identifier for a row in its own table. A foreign key (e.g. `tasks.project_id`) is a column that holds a value copied from another table's primary key, used to link two tables together. PostgreSQL enforces this - you cannot insert a task with a `project_id` that doesn't exist in the `projects` table.

**JOIN:** Combines matching rows from two tables into one result, based on a condition (usually a foreign key matching a primary key). For example, joining `tasks` to `projects` on `tasks.project_id = projects.id` lets a query show each task's actual project name instead of just a number.

**Index:** A separate, sorted structure PostgreSQL uses to find matching rows quickly, instead of scanning every row in a table. I added one index: `CREATE INDEX idx_tasks_project_id ON tasks(project_id);` - chosen because filtering tasks by project (`WHERE project_id = ...`) will be the most common query once the API is built, and this is the column that query filters on. Not every column is indexed, because each index adds storage overhead and slows down INSERT/UPDATE/DELETE operations, since every index on a table has to be updated whenever a row changes.

**ON DELETE CASCADE vs ON DELETE SET NULL:** `tasks.project_id` uses `CASCADE` - deleting a project deletes its tasks too, since a task cannot exist without a project. `tasks.assigned_to` uses `SET NULL` - deleting a user does not delete their tasks, it just unassigns them, since a task can still exist without an assignee.

### Learning notes
- An array in memory disappears when the process restarts; a database is separate software writing to disk, so it survives independently of the application process.
- `SELECT *` returns every column, including sensitive ones like `password_hash` - naming specific columns avoids accidentally exposing data an API should never send back.
- `WHERE` on an UPDATE or DELETE is critical - without it, the statement applies to every row in the table.
- `LIMIT`/`OFFSET` implement pagination; `ORDER BY` is required alongside them so pages are consistent and don't overlap.
- `GROUP BY` combined with an aggregate function (like `COUNT`) collapses many rows into one summary row per group.


## Day 5 - Express + PostgreSQL Integration

### Setup
1. Complete the Day 4 database setup (schema.sql and seed.sql).
2. Create a `.env` file in the project root (copy `.env.example` and fill in real values):
```
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/backend_internship
JWT_SECRET=replace_me
```
3. Install dependencies and start the server as usual:
```
npm install
npm run dev
```

### Architecture
```
HTTP Request -> Route -> Middleware -> Controller -> Service -> Repository -> PostgreSQL
```
- **Route** - maps a URL and method to a controller function.
- **Controller** - handles HTTP: reads the request, validates input, picks the status code.
- **Service** - business rules, independent of HTTP and independent of SQL.
- **Repository** - the only layer that writes raw SQL and talks to PostgreSQL directly.

### New endpoints (PostgreSQL-backed)
| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| POST | /projects | Create project | 201 |
| GET | /projects | List projects | 200 |
| GET | /projects/:id | Get one project | 200 / 404 |
| PATCH | /projects/:id | Update project | 200 / 404 |
| DELETE | /projects/:id | Delete project | 204 / 404 |
| POST | /projects/:id/tasks | Create task under a project | 201 / 404 (unknown project) |
| GET | /projects/:id/tasks | List a project's tasks | 200 / 404 (unknown project) |
| PATCH | /tasks/:id | Update task | 200 / 404 |
| DELETE | /tasks/:id | Delete task | 204 / 404 |

### Parameterized queries
Every repository query uses placeholders (`$1`, `$2`, ...) with values passed as a separate array, instead of building SQL strings by concatenating user input directly. This prevents SQL injection: PostgreSQL always treats placeholder values as data, never as part of the SQL command itself, no matter what characters the input contains.

### Persistence proof
Created a task, restarted the server completely (`Ctrl+C` then `npm run dev`), and confirmed with `GET /projects/1/tasks` that the task was still there - along with a previously deleted task staying deleted. This confirms data now lives in PostgreSQL, independent of the Node process, unlike the in-memory arrays from Days 1-3.

### Learning notes
- A repository is the only layer allowed to contain raw SQL. Controllers and services never see SQL directly, which means the database could be swapped later without touching HTTP or business logic code.
- `$1`/`$2` parameterized queries are a security requirement, not a style choice - they stop SQL injection by keeping user input separate from the SQL command structure.
- `async`/`await` is essential here because a database query takes real time (a round trip to PostgreSQL), unlike the instant in-memory array operations from Days 1-3.
- Checking that a parent resource exists (e.g. a project) before creating a child resource (a task) gives a clean 404 instead of letting a foreign key constraint fail with a confusing 500 error.
- `RETURNING *` in an INSERT or UPDATE statement returns the affected row immediately, avoiding a second query just to see what changed.


## Day 6 - Authentication: Passwords and JWT

### New endpoints
| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| POST | /auth/register | Register a new user | 201 / 400 / 409 |
| POST | /auth/login | Log in and receive a JWT | 200 / 400 / 401 |
| GET | /users/me | Get the current authenticated user (protected) | 200 / 401 |

### How authentication works
Registration hashes the password with bcrypt before storing it - the real password is never saved anywhere. Login looks up the user by email, uses `bcrypt.compare()` to check the supplied password against the stored hash (without ever reversing the hash), and if it matches, signs a JWT containing the user's id, email and role, valid for 2 hours.

The JWT is sent back to the client, which must include it on future requests as `Authorization: Bearer <token>`. An `authenticate` middleware checks this header, verifies the token's signature and expiry, and attaches the decoded payload to `req.user` - if verification fails for any reason (missing header, invalid signature, expired token), the request is rejected with 401 before it ever reaches the route handler.

### Hashing vs. encryption
Hashing is one-way: there is no way to turn a bcrypt hash back into the original password. Login works by hashing the newly supplied password's comparison through `bcrypt.compare()`, which re-derives the hash using the salt stored inside the existing hash and checks whether the result matches - never by decrypting anything. I confirmed this directly: hashing the same password twice produces two different-looking hashes (because of a random salt), yet both still correctly verify against the original password.

### What a JWT proves (and doesn't)
A JWT's signature proves the token was issued by this server and hasn't been tampered with since. It does NOT mean the contents are secret - the payload is only base64-encoded, not encrypted, and I verified this directly: decoding a token's payload with no secret key at all revealed the real userId and email in plain text. A JWT also doesn't prove the current holder is the legitimate user - if a valid token is stolen, the server has no way to distinguish the thief from the real user until the token expires.

### Testing
Tested in `requests.http`: register (success, duplicate email, short password), login (success, wrong password, unknown email - both failures return an identical generic message), and `/users/me` with no token, an invalid token, an expired token, and a valid token.

### Learning notes
- Authentication answers "who are you?" (proven at login). Authorization answers "what are you allowed to do?" (checked afterward, using data like the `role` column - built in Day 7).
- A generic "Invalid email or password" message for both a wrong password and an unknown email prevents an attacker from learning which emails are registered (user enumeration).
- `401 Unauthorized` means identity wasn't proven (no/bad/expired token). `403 Forbidden` means identity is known but the action isn't permitted - that distinction matters for Day 7.
- Middleware can block a request before it reaches a route handler simply by not calling `next()` - this is how `authenticate` protects `/users/me`.
- `JWT_SECRET` must come from an environment variable, never hard-coded, because anyone with the secret can forge valid tokens for any user.


## Day 7 - Authorization, Validation and Error Handling

### New endpoint
| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| GET | /admin/users | List all users (admin only) | 200 / 403 / 401 |

### Authorization rules
- Any authenticated user may create a project. The owner is always taken from the authenticated token (`req.user.userId`), never from the request body - this prevents a client from claiming ownership on someone else's behalf.
- Only a project's owner (or an admin) may update or delete it. Tasks inherit this rule from their parent project, since tasks have no owner of their own.
- Reading projects and tasks remains public; writing requires authentication.
- `role: 'admin'` is required for `/admin/users`, enforced by a dedicated `requireAdmin` middleware that runs after `authenticate`.

### Validation
Request bodies are validated with [Zod](https://zod.dev) via a reusable `validate(schema)` middleware, before any controller or database logic runs:
- Registration: name required, valid email format, password minimum length.
- Project creation/update: name required with a maximum length, description length capped.
- Task creation/update: title required with a maximum length, status restricted to an exact enum (`todo`, `in-progress`, `done`), `assignedTo` must be a positive integer.

### Error handling
A centralized `errorHandler` middleware (last in the middleware chain) logs full error details server-side (timestamp, method, path, and the real error) but only ever returns a safe, generic message to the client. Known PostgreSQL error codes (unique constraint violations, foreign key violations) are mapped to appropriate 400/409 responses; anything else falls back to a generic 500 with no leaked internal details.

### Status codes used deliberately
| Code | Meaning in this project |
|---|---|
| 200 | Successful read/update |
| 201 | Resource created |
| 204 | Resource deleted, no content |
| 400 | Invalid request data (validation failure) |
| 401 | Missing, invalid, or expired authentication |
| 403 | Authenticated, but not permitted (wrong owner, wrong role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email) |
| 500 | Unexpected server error (generic message only) |

### Testing
Tested at least 13 negative scenarios against the real running API, including: non-owner attempting to update/delete a project (403), missing token on write endpoints (401), non-admin on an admin route (403), duplicate email (409), invalid email format (400), overly long project name (400), invalid task status (400), expired token (401), malformed token (401), unknown project/task ids (404), and a real database connection failure confirmed to return a generic 500 with no leaked connection details (verified both the client response and the full server-side log for the same failure).

### Learning notes
- `401` means identity isn't established (no/bad/expired token). `403` means identity is known but the specific action isn't permitted. Mixing these up is a common mistake - I kept them deliberately separate throughout.
- Never trust an identifier (like an owner id) from the request body when the authenticated identity is already available from a verified token - always prefer `req.user`.
- Validation (is this data shaped correctly?) and authorization (is this specific user allowed to do this?) are different concerns and happen in a specific order: validate the shape first, then check permission, then touch the database.
- A centralized error handler lets every route log consistently and guarantees the client never sees implementation details, even for failures no developer anticipated (confirmed directly by breaking the database connection and observing the generic 500).


## Note on project structure
This project uses `src/models/` instead of `src/types/` for the Task/TaskStatus/TaskPriority/ApiResponse type definitions. This was established during Day 3's refactor into layers and kept consistent throughout Days 4-7 to avoid breaking existing imports. Functionally it serves the same purpose as a `types/` folder.

## What I learned in Days 4-7
- **Day 4:** Relational database design - primary keys, foreign keys, one-to-many relationships, and why in-memory arrays disappear on restart while PostgreSQL data survives. Wrote and tested SELECT, WHERE, JOIN, UPDATE, DELETE, pagination (LIMIT/OFFSET), and an aggregate query (GROUP BY + COUNT), and added one index chosen based on the most common expected query pattern.
- **Day 5:** Connecting Express to PostgreSQL through a proper layered architecture (route -> controller -> service -> repository -> database). Parameterized queries ($1, $2, ...) to prevent SQL injection - verified directly by tracing what a malicious input string would do if concatenated into raw SQL instead. Proved persistence by restarting the server and confirming data survived.
- **Day 6:** Password hashing with bcrypt (one-way, salted, verified via bcrypt.compare rather than decryption) and JWT issuing. Verified hands-on that a JWT payload is readable without any secret (it's encoded, not encrypted) but that its signature cannot be forged or tampered with. Built authentication middleware and a protected /users/me endpoint, tested against no/invalid/expired/valid tokens.
- **Day 7:** The difference between authorization and authentication in practice - ownership checks (a user may only modify what they own), an admin role with its own middleware, and why a user ID must come from a verified token rather than the request body. Replaced manual validation with Zod schemas, and built a centralized error handler that logs full details server-side while never leaking implementation details (like raw database errors) to API clients - confirmed by deliberately breaking the database connection and observing both sides of the failure.