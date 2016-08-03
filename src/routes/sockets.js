module.exports = function(io){

    io.on('connection',function(socket){
        socket.on('room',function(room){
            socket.join(room);
            io.sockets.emit('message', 'welcome!');
            console.log('joined ' + room);
        });
    })
}
