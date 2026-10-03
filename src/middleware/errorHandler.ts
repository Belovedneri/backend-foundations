import type { Request, Response, NextFunction } from 'express'

interface PgError {
  code?: string
  detail?: string
}

function isPgError(error: unknown): error is PgError {
  return typeof error === 'object' && error !== null && 'code' in error
}

// Express recognises an error handler by its 4 parameters.
export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  // Log full details server-side only - this is for developers, never sent to the client
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - Error:`, error)

  // Malformed JSON body
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ success: false, error: 'Invalid JSON in request body' })
    return
  }

  // PostgreSQL errors - map known codes to safe responses, never expose raw details
  if (isPgError(error)) {
    if (error.code === '23505') {
      // unique_violation
      res.status(409).json({ success: false, error: 'A record with this value already exists' })
      return
    }
    if (error.code === '23503') {
      // foreign_key_violation
      res.status(400).json({ success: false, error: 'Referenced resource does not exist' })
      return
    }
    // Any other database error - never leak the raw PostgreSQL message to the client
    res.status(500).json({ success: false, error: 'Internal server error' })
    return
  }

  // Fallback for anything unexpected
  res.status(500).json({ success: false, error: 'Internal server error' })
}