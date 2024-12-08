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

let messages = [];

io.on('connection', socket => {
    console.log('Novo usuário conectado! ID: ' + socket.id)
    console.log('Novo usuário conectado! ID: ' + socket.id);

    socket.emit('previousMessage', messages);
    
    socket.on('sendMessage', data => {
        messages.push(data);

        socket.broadcast.emit('receivedMessage', data);


    });

});

server.listen(3000, () => {
console.log('http://localhost:3000')
})