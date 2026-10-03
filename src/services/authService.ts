import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail } from '../repositories/userRepository.js'
import type { UserRow } from '../repositories/userRepository.js'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Check your .env file.')
}

export type SafeUser = Omit<UserRow, 'password_hash'>

function toSafeUser(user: UserRow): SafeUser {
  const { password_hash, ...safeUser } = user
  return safeUser
}

export async function registerUser(name: string, email: string, password: string): Promise<SafeUser> {
  const existing = await findUserByEmail(email)
  if (existing) {
    throw new Error('EMAIL_TAKEN')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser(name, email, passwordHash)
  return toSafeUser(user)
}

export async function loginUser(email: string, password: string): Promise<{ user: SafeUser; token: string }> {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatches) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET as string,
    { expiresIn: '2h' }
  )

  return { user: toSafeUser(user), token }
}