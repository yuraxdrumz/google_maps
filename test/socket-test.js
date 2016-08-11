process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

var io = require('socket.io-client');



describe("Chat Server",function(){

    var socketURL = 'http://localhost:3000';
    var options ={
        transports: ['websocket'],
        'force new connection': true
    };
    var user1 = io.connect(socketURL, options);

    it('should connect to socket.io', function(done){
        user1.on('connect',function(){
            user1.on('message',function(msg){
                msg.should.equal('connected to room default');
                done();
            });
        });
    });
});

