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

app.use('/auth', authRoute)

// handleError

app.use(handleErrRoute, handleErr)

app.listen(process.env.PORT, () => {
    console.log('server is running on PORT ', process.env.PORT)
})

