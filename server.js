const express = require('express');
const app = express();
require('dotenv').config()
var morgan = require('morgan')
var cors = require('cors');
const authRoute = require('./src/routes/auth.route');
const { handleErrRoute, handleErr } = require('./src/middlewares/handleErr.middleware');
app.use(cors())
app.options('*', cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use('/', (req, res, next) => {
    return res.status(200).json({
        status: 200,
        message: 'Server is running'
    })
})
app.use('/auth', authRoute)

// handleError
app.use(handleErrRoute, handleErr)

app.listen(process.env.PORT, () => {
    console.log('server is running on PORT ', process.env.PORT)
})

