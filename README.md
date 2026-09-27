# Backend Foundations

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