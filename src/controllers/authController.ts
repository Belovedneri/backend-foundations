import type { Request, Response, NextFunction } from 'express'
import { registerUser } from '../services/authService.js'

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body ?? {}

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ success: false, error: 'name is required and must be a non-empty string' })
      return
    }
    if (typeof email !== 'string' || email.trim() === '') {
      res.status(400).json({ success: false, error: 'email is required and must be a non-empty string' })
      return
    }
    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ success: false, error: 'password is required and must be at least 8 characters' })
      return
    }

    const user = await registerUser(name.trim(), email.trim().toLowerCase(), password)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
      res.status(409).json({ success: false, error: 'An account with this email already exists' })
      return
    }
    next(error)
  }
}