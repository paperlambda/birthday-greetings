import { AppError, UnknownError } from '@/errors'
import { NextFunction, Request, Response } from 'express'

const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err)
    let appError: AppError = new UnknownError()

    if (err instanceof AppError) {
        appError = err
    }

    res.status(appError.statusCode).json({
        success: false,
        error: appError.message,
    })
}

export default errorHandler
