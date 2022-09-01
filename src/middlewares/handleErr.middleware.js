const { nextTick } = require("process");

module.exports = {
    handleErrRoute: (req, res, next) => {
        const err = new Error('Can not request with route')
        err.status = 404;
        return next(err)
    },

    handleErr: (err, req, res, next) => {
        return res.status(err.status || 500).json(
            {
                status: err.status || 500,
                message: err.message || 'Internal Server Error'
            }
        )
    }
}

