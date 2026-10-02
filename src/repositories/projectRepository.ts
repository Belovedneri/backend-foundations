import { pool } from '../config/db.js'

export interface ProjectRow {
  id: number
  name: string
  description: string | null
  owner_id: number
  created_at: Date
}

export async function createProject(name: string, description: string | null, ownerId: number): Promise<ProjectRow> {
  const result = await pool.query<ProjectRow>(
    'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
    [name, description, ownerId]
  )
  return result.rows[0] as ProjectRow
}

export async function findAllProjects(): Promise<ProjectRow[]> {
  const result = await pool.query<ProjectRow>('SELECT * FROM projects ORDER BY id')
  return result.rows
}

export async function findProjectById(id: number): Promise<ProjectRow | null> {
  const result = await pool.query<ProjectRow>('SELECT * FROM projects WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function updateProject(id: number, updates: { name?: string; description?: string | null }): Promise<ProjectRow | null> {
  const result = await pool.query<ProjectRow>(
    `UPDATE projects
     SET name = COALESCE($2, name),
         description = COALESCE($3, description)
     WHERE id = $1
     RETURNING *`,
    [id, updates.name ?? null, updates.description ?? null]
  )
  return result.rows[0] ?? null
}

export async function deleteProject(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM projects WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}