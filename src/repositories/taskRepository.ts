import { pool } from '../config/db.js'

export interface TaskRow {
  id: number
  title: string
  description: string | null
  status: string
  project_id: number
  assigned_to: number | null
  created_at: Date
}

export async function createTask(
  title: string,
  description: string | null,
  status: string,
  projectId: number,
  assignedTo: number | null
): Promise<TaskRow> {
  const result = await pool.query<TaskRow>(
    `INSERT INTO tasks (title, description, status, project_id, assigned_to)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, status, projectId, assignedTo]
  )
  return result.rows[0] as TaskRow
}

export async function findTasksByProjectId(projectId: number): Promise<TaskRow[]> {
  const result = await pool.query<TaskRow>(
    'SELECT * FROM tasks WHERE project_id = $1 ORDER BY id',
    [projectId]
  )
  return result.rows
}

export async function findTaskById(id: number): Promise<TaskRow | null> {
  const result = await pool.query<TaskRow>('SELECT * FROM tasks WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function updateTask(
  id: number,
  updates: { title?: string; description?: string | null; status?: string; assignedTo?: number | null }
): Promise<TaskRow | null> {
  const result = await pool.query<TaskRow>(
    `UPDATE tasks
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         status = COALESCE($4, status),
         assigned_to = COALESCE($5, assigned_to)
     WHERE id = $1
     RETURNING *`,
    [id, updates.title ?? null, updates.description ?? null, updates.status ?? null, updates.assignedTo ?? null]
  )
  return result.rows[0] ?? null
}

export async function deleteTask(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}