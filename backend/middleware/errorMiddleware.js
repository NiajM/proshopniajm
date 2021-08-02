const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode  // If gives 200 response then makes it 500 and 500 means it's a server error, else it will be original status code
    res.status(statusCode)
    res.json({
        message: err.message,   // Message will come from error object
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export { notFound, errorHandler }