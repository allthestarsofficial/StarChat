export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(400, message, code);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, code = 'NOT_FOUND') {
    super(404, `${resource} not found`, code);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(401, message, code);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(403, message, code);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'CONFLICT') {
    super(409, message, code);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(
    message = 'Too many requests',
    code = 'RATE_LIMITED',
    public retryAfter?: number
  ) {
    super(429, message, code);
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR') {
    super(500, message, code);
    this.name = 'InternalServerError';
  }
}
