const http = require('http').Server();
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://norival.ddns.net:4200']
    }
});

const User = require('./class/User');
const Message = require('./class/Message');
const Channels = require('./class/Channels');

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

io.on('connection', socket => {
    const user = {
        uuid: socket.handshake.auth.user.uuid,
        socketIds: [socket.id],
        nickname: socket.handshake.auth.user.nickname,
    };
    users.add(user);

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
        users.del(user.uuid, socket.id);
        socket.broadcast.emit('userlist.update', users);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
