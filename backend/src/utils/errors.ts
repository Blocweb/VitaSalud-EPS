export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error.code === '23505') {
    // Unique constraint violation
    const field = error.detail?.match(/Key \((.*?)\)/)?.[1] || 'field';
    return new AppError(409, `${field} already exists`, true);
  }

  if (error.code === '23503') {
    // Foreign key constraint violation
    return new AppError(400, 'Referenced record does not exist', true);
  }

  if (error.code === '23502') {
    // NOT NULL constraint violation
    return new AppError(400, 'Missing required field', true);
  }

  return new AppError(500, error.message || 'Internal Server Error', false);
};

export default {
  AppError,
  handleError,
};
