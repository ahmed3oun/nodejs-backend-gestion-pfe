const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const authRoute = require('./routes/auth')

//Setting up the config file
const dotenv = require('dotenv')
dotenv.config({ path: './config/.env' })

//middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors())

//Routes
app.use('/api/auth',authRoute) 


module.exports = app ;