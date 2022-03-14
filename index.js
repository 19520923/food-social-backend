const express = require('express')
const app = express()

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

const {MONGODB_URI, PORT} = require("./config")

const AuthRouters = require('./routers/Authentication')
const UserRouters = require('./routers/User')
const FoodRouters = require('./routers/Food')

dotenv.config()

mongoose
.connect(
    MONGODB_URI,
    { 

    })
    .then(() => {
        console.log('database connected')
        server.listen(PORT, () => console.log('server started on port 8800'))
    })
    .catch((err) => console.log(err))
    

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())
app.use((req, res, next)=>{
    io.req = req
    req.io = io
    next()
})

require('./socket.js')(io)

app.use('/api/auth', AuthRouters)
app.use('/api/user', UserRouters)
app.use('/api/food', FoodRouters)

