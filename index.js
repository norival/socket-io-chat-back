const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

const Database = require('./class/Database');
const User = require('./class/User');
const Message = require('./class/Message');

// const db = new Database();
const user = new User();
const message = new Message();

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', socket => {
    console.log('a user connected: ' + socket.id);
    user.addUser({
        uuid: socket.handshake.auth.uuid,
        socketId: socket.id,
        nickname: socket.handshake.auth.nickname,
        online: true,
    });

    // send user list when a user connect
    // TODO: send only the new user
    io.emit('user.connect', user);

    socket.on('disconnect', () => {
        user.findBySocketId(socket.id).online = false;
        socket.broadcast.emit('user.disconnect', user);
    });

    socket.on('message', msg => {
        socket.broadcast.emit('message', {
            user: user.findBySocketId(socket.id),
            content: msg,
        });
        message.addMessage(user.findBySocketId(socket.id).uuid, msg)
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
