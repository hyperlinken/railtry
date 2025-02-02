const express = require("express")
const http=require('http');
const socketIo=require('socket.io');
const cors = require('cors');
const mongoose=require('mongoose');

const app= express();
const server = http.createServer(app);

const DB="mongodb+srv://saurav:53846766@cluster0.jgcxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(DB).then(()=>{
    console.log("connection successfully");
}).catch((e)=>{
    console.log(e);
})

const messageSchema=new mongoose.Schema({
    message:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now, 
        required: true,
    }
})

messageSchema.index({date:1},{expireAfterSeconds: 3600});
const user= mongoose.model('user',messageSchema);

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

io.on('connection',async (socket)=>{
    console.log('A new user connected:', socket.id);

    const fe=await user.find({});
    v=[];
    fe.map((user)=>{
        v.push(user.message);
    })
    socket.emit('start',v);

    socket.on('user-msg', async (message) => {
        io.emit('msg', message); // ✅ Broadcast message to all clients

        await user.create({
            message: message,
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
