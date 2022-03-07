const express = require('express')
const bodyParser = require('body-parser')
const color = require('colors')

const morgan = require('morgan')
const routes = require('./API/routes/blockchainroutes')
const errorHandler = require('./API/Middleware/errorHandler')


const app = express()

app.use(express.json({ strict: false }))
app.use(morgan('dev'))

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

app.use(errorHandler)
app.use('/api/v1/', routes)

const PORT = process.argv[2]
const server = app.listen(PORT, () => { console.log(`program running in ${process.env.NODE_ENV} mode and listening on ${PORT} `.cyan.inverse) })
process.on('unhandledRejection', (err, promise) => {
    console.log(`Opps unhandled rejection😟\nError : ${err.message}`.bgRed)
    server.close(() => { process.exit(1) })
})
