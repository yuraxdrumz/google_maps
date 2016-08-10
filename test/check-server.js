process.env.NODE_ENV = 'test';
var mongoose = require('mongoose');
var User = require('../src/models/user-model');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Blobs', function() {
        beforeEach(function(done) { //Before each test we empty the database
        User.remove({}, function(err){
           done();
        });
    })

  it('should get /', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
    it('should get register on /register', function(done){
        chai.request(server)
        .get('/register')
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    });
    it('show post login /login', function(done){
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
            .set('Accept', 'application/vnd.burgers.api+json')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.user.should.have.property('_id');
                res.body.user.should.have.property('first_name');
                res.body.user.should.have.property('last_name');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('salt');
                res.body.user.should.have.property('hash');
                done();
            })
    })

});
