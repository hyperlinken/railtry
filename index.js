const express = require("express")
const http=require('http');
const socketIo=require('socket.io');
const cors = require('cors');

const app= express();
const server = http.createServer(app);

// app.use(cors({
//     origin: 'https://hyperlinken.github.io/frontend', // Allow your frontend origin
//     methods: ['GET', 'POST'],
//     credentials: true,
// }));


app.get("/hi" , (req , res)=> {
    res.send("hi");
})


const port=process.env.PORT || 5000;
app.listen( port , () =>{
    console.log("server is running");
})
