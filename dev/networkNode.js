const express = require('express')
const bodyParser = require('body-parser')
const color = require('colors')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
// dotenv.config({ path: './config/config.env' })
// const Finecoin = require('../dev/API/Model/Finecoin')

const morgan = require('morgan')
const routes = require('./API/routes/blockchainroutes')
const userroutes = require('./API/routes/userroute')
const errorHandler = require('./API/Middleware/errorHandler')
const connectDb = require('./API/config/db')

connectDb()
const app = express()
app.use(errorHandler)

app.use(express.json({ strict: false }))
app.use(morgan('dev'))

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1/', routes)
app.use('/api/v1/user', userroutes)
app.get('/block-explorer', function (req, res) {
    res.sendFile('./FE/index.html', { root: __dirname })
})

const PORT = process.argv[2]
const server = app.listen(PORT, () => { console.log(`program running in ${process.env.NODE_ENV} mode and listening on ${PORT} `.cyan.inverse) })
process.on('unhandledRejection', (err, promise) => {
    console.log(`Opps unhandled rejection😟\nError : ${err.message}`.bgRed)
    server.close(() => { process.exit(1) })
})


