const io = require('socket.io')(3000);

let userArr = [];

io.on('connection', (socket) => {
    socket.on('user-register', user => {
        let isExist = userArr.some(e => {
            return e.username === user.username;
        });
        if (isExist) {
            return false;
        }

        socket.peerId = user.peerId;

        userArr.push(user);
        socket.emit('list-user-online', userArr);
        socket.broadcast.emit('new-user', user);
    });

    socket.on('disconnect', () => {
        let index = userArr.findIndex(user => {
            return userArr.peerId === socket.peerId;
        });
        userArr.splice(index, 1);

        io.emit('user-disconnect', socket.peerId);
    });
});