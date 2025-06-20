import { Request, Response } from 'express'

const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Not found',
    })
}

export default notFoundHandler
