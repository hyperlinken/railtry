const express = require("express")
const http=require('http');
const socketIo=require('socket.io');
const cors = require('cors');

const app= express();
const server = http.createServer(app);

app.use(cors({
    origin: 'https://hyperlinken.github.io/frontend', // Allow your frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
}));

const io = socketIo(server, {
    cors: {
        origin: 'https://hyperlinken.github.io/frontend',
        methods: ['GET', 'POST'],
    }
});

app.get("/hi" , (req , res)=> {
    res.send("hi");
})

io.on('connection',(socket)=>{
    console.log('A new user connected:', socket.id);

    socket.on('user-msg', (message) => {
        console.log('Message received:', message);
        io.emit('msg', message); // ✅ Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})

const port=process.env.PORT || 5000;
app.listen( port , "0.0.0.0" , () =>{
    console.log("server is running");
})
