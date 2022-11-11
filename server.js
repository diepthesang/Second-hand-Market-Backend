const express = require('express');
var paypal = require('paypal-rest-sdk');
paypal.configure({
    
});
const app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser())
var path = require('path');
global.__dirBaseRoot = __dirname;
app.use(express.static(path.join(__dirname, '/src/public/')))
require('dotenv').config()
var morgan = require('morgan')
var cors = require('cors');
const authRoute = require('./src/routes/auth.route');
const userRoute = require('./src/routes/user.route')
const commonRoute = require('./src/routes/common.route')
const { handleErrRoute, handleErr } = require('./src/middlewares/handleErr.middleware');
const db = require('./src/db/models');
app.use(cors())
app.options('*', cors())
app.use(morgan('tiny'))
var bodyParser = require('body-parser');
const ms = require('ms');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('/public'));
// app.use('src/public/upload', express.static('images'));

console.log(__dirBaseRoot);

// TEST ROUTE
app.get('/', (req, res, next) => {
    res.cookie('access_token', '123', {
        maxAge: ms('10 days'),
        httpOnly: true,
        secure: false,
    })

    res.json('test route second-hand-market')
})


// authentication route
app.use('/auth', authRoute)

// user route
app.use('/user', userRoute)

app.use('/common', commonRoute);


// handleError
app.use(handleErrRoute, handleErr)

let port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('server is running on PORT ', port)
})

