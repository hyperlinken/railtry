const express = require("express")
const http=require('http');
const socketIo=require('socket.io');
const axios = require('axios');
const cors = require('cors');

const app= express();
const server=http.createServer(app);

app.use(cors({
    origin: 'https://hyperlinken.github.io', // Allow your frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
}));

const io = new Server(server, {
    cors: {
        origin: 'https://hyperlinken.github.io', // Allow WebSocket connections from this origin
        methods: ['GET', 'POST'],
    },
});

app.get("/hi" , (req , res)=> {
    res.send("hi");
})

io.on('connection',(socket)=>{
    console.log('new connection has been established\n');
    socket.on('user-msg',(message)=>{
        io.emit('msg',message);
    })
})

const port=process.env.PORT || 5000;
app.listen( port , () =>{
    console.log("server is running");
})