const express = require("express")
const http=require('http');
const socketIo=require('socket.io');
const cors = require('cors');
const mongoose=require('mongoose');

const app= express();
const server = http.createServer(app);

const DB="mongodb+srv://hs26042004markam:26042004@cluster0.epdzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DB).then(()=>{
    console.log("connection successfully");
}).catch((e)=>{
    console.log(e);
})

const messageSchema=new mongoose.Schema({
    message:{
        type: String,
    },
    replied:{
        type: String,
        default: ""
    },
    createdAt: { 
        type: Date,
        expires: 43200,
        index: true,
        default: Date.now 
    },
})

const user= mongoose.model('user',messageSchema);

app.use(cors({
    origin: 'https://hyperlinken.github.io/frontend',
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

io.on('connection',async (socket)=>{

    console.log('A new user connected:', socket.id);

    const fe= await user.find({});
    const v = fe.map(user => ({ message: user.message, replied: user.replied }))

    socket.emit('start',v);

    socket.on('user-msg', async (message) => {
        io.emit('msg', message); // ✅ Broadcast message to all clients

        await user.create({
            message: message.message,
            replied: message.replied
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})

const port=process.env.PORT || 5000;
server.listen( port , "0.0.0.0" , () =>{
    console.log("server is running");
})
