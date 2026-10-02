import { pool } from '../config/db.js'

export interface UserRow {
  id: number
  name: string
  email: string
  password_hash: string
  role: string
  created_at: Date
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<UserRow> {
  const result = await pool.query<UserRow>(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, passwordHash]
  )
  return result.rows[0] as UserRow
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0] ?? null
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const result = await pool.query<UserRow>('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0] ?? null
}