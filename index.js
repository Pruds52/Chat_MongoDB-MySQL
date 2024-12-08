const express = require('express');
const ejs = require('ejs');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {
    res.render('index.html');
});

function connectDB() {

    let dbUrl = '';

    mongoose.connect(dbUrl);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback(){
        console.log("Atlas mongoDB conectado!");
    });
}

connectDB();

let Message = mongoose.model('Message',{ author : String, data_hora : String, message : String});

let messages = [];

Message.find({})
    .then(docs=>{
        console.log('DOCS: ' + docs);
        messages = docs;
        console.log('MESSAGES: ' + messages);
    }).catch(err=>{
        console.log(err);
});

io.on('connection', socket=>{

    console.log(`Novo usuário conectado ${socket.id}`);

    socket.emit('previousMessage', messages);

    socket.on('sendMessage', data => {

    let message = new Message(data);
    message.save()
        .then(
            socket.broadcast.emit('receivedMessage', data)
        )
        .catch(err=>{
            console.log('ERRO: ' + err);
        });
    });
})

server.listen(3000, () => {
    console.log('http://localhost:3000')
});