process.env.NODE_ENV = 'test';
var mongoose = require('mongoose');
var User = require('../src/models/user-model');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);


describe('Users', function() {
    beforeEach(function(done) { //Before each test we empty the database
        User.remove({}, function(err){
            console.log('removed');
            done();
        });
    });

    describe('Get test', function() {
      it('should get /', function(done) {
        chai.request(server)
        .get('/')
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
      });
    });

    describe('Register Test',function(){
        it('should get register on /register', function(done){
            chai.request(server)
            .get('/register')
            .end(function(err,res){
                res.should.have.status(200);
                done();

            })
        });
    });

    describe('Register Post',function(){
       it('should show post register /register', function(done){
            var user = new User({
                _id: mongoose.Types.ObjectId(),
                first_name: 'yura',
                last_name: 'khomyakov',
                email: 'yura@gmail.com'
                });
                user.setPassword('444444');
                chai.request(server)
                .post('/register')
                .send(user)
                .end(function(err, res){
                    res.should.have.status(200);
                    done();
                })
        })

    });
    describe('Login Post', function(){
        it('show show post login /login', function(done){
            var user = new User({
                _id: mongoose.Types.ObjectId(),
                first_name: 'yura',
                last_name: 'khomyakov',
                email: 'yura@gmail.com'
                });
                user.setPassword('444444');
                chai.request(server)
                .post('/login')
                .send(user)
                .end(function(err, res){
                    res.should.have.status(200);
                    done();
                })
        })
    });
    describe('Logout get', function(){
        it('should logout',function(done){
            chai.request(server)
            .get('/logout')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            })
        })
    });
    describe('Main reject', function(){
        it('should reject main',function(done){
            chai.request(server)
            .get('/main')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            })
        })
    });
    describe('Error 404', function(){
        it('should return 404', function(done){
            chai.request(server)
            .get('/blabla')
            .end(function(err,res){
                res.should.have.status(404);
                done();
            })
        })
    })
});


