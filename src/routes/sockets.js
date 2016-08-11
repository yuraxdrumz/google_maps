module.exports = function (io) {
    var rooms = ['default'];
    var sockets = {};
    io.on('connection',function (socket) {
        socket.join(rooms[0]);
        sockets[socket.id] = rooms[0];
        io.sockets.to(sockets[socket.id]).emit('message','connected to room ' + sockets[socket.id]);
        socket.on('message', function (msg) {
            for (var sock in sockets) {
                if (sock === socket.id) {
                    io.sockets.to(sockets[sock]).emit('message',msg);
                }
            }

        })
        socket.on('disconnect', function () {
            io.sockets.to(sockets[socket.id]).emit('message','left the room');
            socket.leave(sockets[socket.id]);
            delete sockets[socket.id];
        });

        socket.on('change-room', function (room) {
            socket.leave(sockets[socket.id]);
            sockets[socket.id] = room;
            socket.join(room);

        });
    });
};
