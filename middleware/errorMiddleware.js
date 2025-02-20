const errorMiddleware=(err,req,res,next)=>{
  // Get error details
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';
  let errorType = 'SERVER_ERROR';

  // Determine error type based on status code
  switch (statusCode) {
    case 400:
      errorType = 'VALIDATION_ERROR';
      break;
    case 401:
      errorType = 'UNAUTHORIZED';
      break;
    case 403:
      errorType = 'FORBIDDEN';
      break;
    case 404:
      errorType = 'NOT_FOUND';
      break;
    case 409:
      errorType = 'CONFLICT';
      break;
    case 422:
      errorType = 'UNPROCESSABLE_ENTITY';
      break;
    case 429:
      errorType = 'TOO_MANY_REQUESTS';
      break;
    case 500:
      errorType = 'SERVER_ERROR';
      break;
    default:
      errorType = 'UNKNOWN_ERROR';
  }

  // Send structured error response
  res.status(statusCode).json({
    success: false,
    error: {
      type: errorType,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}