const users = require('./../../../../controllers/users.js');
var User = require("./../../../../models/User.js");
let chaiHttp = require('chai-http');
let chai = require('chai');
let sinon = require('sinon');
var expect = chai.expect;
var should = chai.should();
var express = require("express");
let server = require('@server');
var app = express();
chai.use(chaiHttp);

describe('User', () => {
    // beforeEach((done) => { //Before each test we empty the database
    // 	User.remove({}, (err) => { 
    // 		done();           
    // 	}); 
    // });

    describe('controllers User', function(){
    	it('exists', function(){
    		expect(users).to.exist

            it('should respond with the user that was added', (done) => {
            	let user = {
            		pseudo: 'Ludvic16',
            		fullname: 'Ludovic MOUKOURI',
            		email: 'ludovicmoukouri@yahoo.fr',
            		password: '123456'
            	}
            	chai.request(server)
            	.post('/users/register')
            	.send(user)
            	.end((err, res) => {
            		should.not.exist(err);
            		res.status.should.equal(200);
            		res.body.should.be.an('object');
            		res.body.user.should.have.property('pseudo');
				// res.body.should.include.keys(
				// 	'_id', 'name', 'description', 'release_year', 'genre'
				// 	);
				done();
			});
            });
        });

    		describe('Login', () => {
    			it('Login method', (done) => {
    				let user_login = {
    					email: 'ludovicmoukouri@yahoo.fr',
    					password: '123456'
    				}
    				chai.request(server)
    				.post('/users/login')
    				.send(user_login)
    				.end((err, res) => {
    					should.not.exist(err);
    					res.status.should.equal(200);
    					res.body.should.be.an('object');
    					expect(res.body.message.should.equal('OK'));
					// res.body.should.include.keys(
					// 	'_id', 'token', 'description', 'release_year', 'genre'
					// 	);
					done();
				});
    			});
    		});

    	})
    })
