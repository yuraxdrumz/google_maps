module.exports = function(io){
    io.on('connection',function(socket){
        socket.on('room',function(data){
            socket.join(data)
            io.to(data).emit('message','connected to room' + data);
            console.log(data)
        });
        socket.on('message',function(data){
            io.to(data.room).emit('message',data.msg);

            console.log(data)
        })

    })
}
