import { Request, Response, NextFunction } from 'express'
import { z } from 'zod/v4'

const validateBody = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
                return
            }
        }
    }
}

export default validateBody
