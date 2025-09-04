import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json({
    limit: '16kb'
}))
app.use(express.urlencoded())
app.use(express.static('/public'))


const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
})

io.on('connection', (socket) => {
    console.log('Client connected : ', socket.id);

    socket.on('join', (chatId) => {
        socket.join(chatId)
        console.log('user connected with chat id: ', chatId)
    })

    socket.on('message', (data) => {
        console.log('data received: ',data)

        io.emit('message',data)

        // io.to(to).emit('message', {
        //     from,
        //     message,
        //     createdAt: Date.now()
        // })
    })
    socket.on('disconnect', () => {
        console.log("client disconnected", socket.id)
    })

})

// app.use((req, res, next) => {
//     req.io = io;
//     req.socket = socket
//     next()
// })



//import routes
import userRoute from './routes/user.routes.js'
import chatRoute from './routes/chat.routes.js'


//use the routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/chats', chatRoute)


export default server