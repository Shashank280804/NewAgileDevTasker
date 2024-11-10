// utils/error.js

const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// Middleware to handle errors globally
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error (you can log to a file or an external service)
    console.error(err);

    // Send the error response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};

module.exports = {
    errorHandler,
    globalErrorHandler
};
