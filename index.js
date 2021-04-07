const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

const Database = require('./class/Database');
const User = require('./class/User');

const db = new Database();

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', socket => {
    console.log('a user connected: ' + socket.handshake.auth.nickname);
    const user = new User(
        socket.handshake.auth.uuid,
        socket.socketId,
        socket.handshake.auth.nickname
    );

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', msg => {
        // TODO adds the message to the database
        console.log(msg);
        // console.log('message: ' + msg.message);
        socket.broadcast.emit('message', msg);
    });

    socket.on('nickname.change', user => {
        console.log(db.findUser(user.uuid));
        db.findUser(user.uuid).nickname = user.nickname
        console.log(db.findUser(user.uuid));
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
