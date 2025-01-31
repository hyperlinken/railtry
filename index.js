const express = require("express")
const socketIo=require('socket.io');
const cors = require('cors');

const app= express();

const io = socketIo(server, { // Initialize Socket.IO with the server
    cors: {
        origin: 'https://hyperlinken.github.io',
        methods: ['GET', 'POST'],
    }
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