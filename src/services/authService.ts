import bcrypt from 'bcrypt'
import { createUser, findUserByEmail } from '../repositories/userRepository.js'
import type { UserRow } from '../repositories/userRepository.js'

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