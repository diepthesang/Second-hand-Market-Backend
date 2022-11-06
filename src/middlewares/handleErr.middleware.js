const { nextTick } = require("process");

module.exports = {
    handleErrRoute: (req, res, next) => {
        const err = new Error('Can not request with route')
        err.status = 404;
        next(err)
    },

    handleErr: (err, req, res, next) => {
        console.log('########errMsg#########', err.message)
        return res.status(err.status || 500).json(
            {
                status: err.status || 500,
                codeMessage: err.codeMessage || 'ERR',
                message: err.message || 'Internal Server Error'
            }
        )
    }
}

