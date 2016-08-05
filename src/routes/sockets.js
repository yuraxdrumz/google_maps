module.exports = function(io){
    var rooms = ['1','2','3'];
    var sockets = {};
    io.on('connection',function(socket){
        socket.join(rooms[0]);
        sockets[socket.id] = rooms[0];
        io.sockets.to(rooms[0]).emit('message','connected!')
        socket.on('message',function(msg){
            for(var sock in sockets){
                if(sock === socket.id){
                    io.sockets.to(sockets[sock]).emit('message',msg)
                }
            }

        })
        socket.on('disconnect',function(){
            socket.leave(sockets[socket.id]);
            delete sockets[socket.id];
        })

        socket.on('change-room',function(room){
            socket.leave(sockets[socket.id]);
            sockets[socket.id] = room;
            socket.join(room);

        })
    })
}
