import type { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser } from '../services/authService.js'

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body
    const user = await registerUser(name, email, password)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
      res.status(409).json({ success: false, error: 'An account with this email already exists' })
      return
    }
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body
    const result = await loginUser(email, password)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ success: false, error: 'Invalid email or password' })
      return
    }
    next(error)
  }
}