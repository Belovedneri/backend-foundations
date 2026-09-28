import type { Request, Response, NextFunction } from 'express'

// Express recognises an error handler by its 4 parameters.
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ success: false, error: 'Invalid JSON in request body' })
    return
  }
  console.error('Unhandled error:', error)
  res.status(500).json({ success: false, error: 'Internal server error' })
}