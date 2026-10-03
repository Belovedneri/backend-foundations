import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const firstIssue = result.error.issues[0]
      res.status(400).json({
        success: false,
        error: firstIssue?.message ?? 'Invalid request body'
      })
      return
    }

    req.body = result.data
    next()
  }
}