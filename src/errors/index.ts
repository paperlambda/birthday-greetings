export class AppError extends Error {
    public readonly statusCode: number

    constructor(message: string, statusCode: number = 500) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

export class UserNotFoundError extends AppError {
    constructor() {
        super('User not found', 404)
    }
}

export class UserAlreadyExistsError extends AppError {
    constructor() {
        super('User already exists', 400)
    }
}

export class InvalidUserIdError extends AppError {
    constructor() {
        super('Invalid user ID', 400)
    }
}

export class UnknownError extends AppError {
    constructor() {
        super('An unknown error occurred', 500)
    }
}
