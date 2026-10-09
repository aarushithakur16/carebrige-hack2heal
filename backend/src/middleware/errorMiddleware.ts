import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message || err);

  // Default to 500
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    statusCode = 422;
    message = 'Validation Error';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File Too Large';
  }

  // Hide sensitive details
  const isProduction = process.env.NODE_ENV === 'production';
  const response = {
    error: message,
    ...(isProduction ? {} : { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
