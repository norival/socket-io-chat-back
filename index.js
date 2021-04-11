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
const Channels = require('./class/Channels');

// const db = new Database();
const users = new User();
const messages = new Message();
const channels = new Channels();

generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

channels.add({
    uuid: generateUuid(),
    name: 'General'
}).add({
    uuid: generateUuid(),
    name: 'Blabla'
});

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', socket => {
    const user = {
        uuid: socket.handshake.auth.user.uuid,
        socketIds: [socket.id],
        nickname: socket.handshake.auth.user.nickname,
    };
    users.addUser(user);

    socket.emit('message', {
        uuid: generateUuid(),
        content: `
        Hello there, <span class="nickname">${user.nickname}</span>! Welcome to
        the <span class="channel">General</span> channel 
        `,
        createdAt: new Date(),
        senderUuid: 'server',
        recipientUuid: user.uuid,
        channelUuid: channels.channels.find(ch => ch.name === 'General').uuid,
        unread: false,
    });
    socket.emit('message', {
        uuid: generateUuid(),
        content: `
        Hello there, <span class="nickname">${user.nickname}</span>! Welcome to
        the <span class="channel">Blabla</span> channel 
        `,
        createdAt: new Date(),
        senderUuid: 'server',
        recipientUuid: user.uuid,
        channelUuid: channels.channels.find(ch => ch.name === 'Blabla').uuid,
        unread: false,
    });

    socket.emit('channel.update', channels.channels);
    io.emit('userlist.update', users);

    socket.on('message', message => {
        message.unread = true
        messages.add(message)
        socket.broadcast.emit('message', message);
    });

    socket.on('message.private', message => {
        message.unread = true;
        messages.add(message);
        message.channelUuid = message.senderUuid;
        const recipientSockets = users.find(message.recipientUuid).socketIds;
        recipientSockets.forEach(sid => {
            socket.to(sid).emit('message', message);
        });
    });

    socket.on('disconnect', () => {
        users.delUser(user.uuid, socket.id);
        socket.broadcast.emit('userlist.update', users);
    });


    // socket.on('message', msg => {
    //     socket.broadcast.emit('message', {
    //         user: user.findBySocketId(socket.id),
    //         content: msg,
    //     });
    //     message.addMessage(user.findBySocketId(socket.id).uuid, msg)
    // });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
