import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/authenticate.js'
import { findUserById } from '../repositories/userRepository.js'

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' })
      return
    }

    const user = await findUserById(req.user.userId)
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' })
      return
    }

    const { password_hash, ...safeUser } = user
    res.status(200).json({ success: true, data: safeUser })
  } catch (error) {
    next(error)
  }
}