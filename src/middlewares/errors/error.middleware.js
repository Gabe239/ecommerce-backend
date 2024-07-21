const errorHandlerMiddleware = (err, req, res, next) => {
    const errorMessage = err.message || err;
    const message = errorMessage
      ? errorMessage.message
      : err.message || 'Internal error';
    const status = errorMessage ? errorMessage.status : 500;
    res.status(status).json({
      error: message,
      status: status,
      code: code,
      data: null,
    });
  };
  
  export default errorHandlerMiddleware;