const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500;

    if (res.headersSent) {
        return next(error);
    }

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid resource ID."
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists."
        });
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    console.error(error);

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? "Internal server error." : error.message
    });
};

module.exports = errorHandler;
