const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const session = require('express-session');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
const config = require('./../config/Config');
url = require('url')
const jwt = require('jsonwebtoken');
const passport = require('passport');

// const passportJWT = require('passport-jwt');
// const ExtractJwt = passportJWT.ExtractJwt;
// const JwtStrategy = passportJWT.Strategy;
// const jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
// jwtOptions.secretOrKey = 'movieratingapplicationsecretkey';

const ws = require('ws');

const app = express();
var expressWs = require('express-ws')(app);

require('../passport')(passport);

var https = require('http');
var WebSocketServer = require('ws').Server
const router = express.Router();
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');

// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
// 	res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS");
// 	next();
// });

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const sessionOption = {
	secret: config.SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: {
		httpOnly: false,
		expires: new Date(Date.now() + 86400000)
	},
	// store:store
};

const sess = session(sessionOption)

app.use(sess)

app.use(passport.initialize());

app.use(passport.session());

//connect to mongodb

// // const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://ludovic:<password>@cluster0-tpowy.mongodb.net/test?retryWrites=true&w=majority";
// const client = mongoose(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }, function() {
	console.log('Connection has been made');
})
.catch(err => {
	console.error('App starting error:', err.stack);
	process.exit(1);
});

// Include controllers
fs.readdirSync("controllers").forEach(function (file) {
	if(file.substr(-3) == ".js") {
		const route = require("./../controllers/" + file)
		route.controller(app)
	}
});

app.use(history());
app.use('/', serveStatic(__dirname + "/../dist"));

router.get('/api/current_user', isLoggedIn, function(req, res) {
	if(req.user) {
		// console.log('SSSSSSSSSSSSSSSSSS ', req);
		// req.session.working = req.user
		// req.session.save();
		res.send({ current_user: req.user })
	} else {
		res.status(403).send({ success: false, msg: 'Unauthorized.' });
	}
})
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
	console.log('error! auth failed')
}
router.get('/api/logout', function(req, res){
	req.logout();
	res.send();
});


router.get('/.*/', function(req, res) {
	res.sendFile(path.join(__dirname + "/../dist/index.html"));
});

const port = process.env.API_PORT || 8081;
app.use('/', router);


var server = https.createServer(app);

var wss = new WebSocketServer({ server });

users = {};

wss.on('connection', function(connection, req) {
	console.log('WebSocket client connected...');
	sess(req, {}, () => {
		console.log('Session is parsed! ', req.session.passport);
	});

	connection.on('message', function (message) {
		var data;
		try {
			data = JSON.parse(message);
		} catch (e) {
			console.log("Error parsing JSON");
			data = {};
		}
		switch (data.type) {
			case "login":
			console.log("User logged in as", data);
			if (users[data.name]) {
				sendTo(connection, {
					type: "login",
					success: false
				});
			} else {
				connection.name = data.name;
				users[data.name] = connection;
				console.log("connectedUser ", data.name)
				sendTo(connection, {
					type: "login",
					success: true
				});
			}
			break;
			case "offer":
			console.log("Sending offer to", data.name);
			var conn = users[data.name];
			if (conn != null) {
				connection.otherName = data.name;
				sendTo(conn, {
					type: "offer",
					offer: data.offer,
					name: connection.name
				});
			}
			break;	
			case "answer":
			console.log("Sending answer to", data.name);
			var conn = users[data.name];
			if (conn != null) {
				connection.otherName = data.name;
				sendTo(conn, {
					type: "answer",
					answer: data.answer
				});
			}
			break;
			case "candidate":
			console.log("Sending candidate to", data.name);
			var conn = users[data.name];
			if (conn != null) {
				sendTo(conn, {
					type: "candidate",
					candidate: data.candidate
				});
			}
			break;
			case "leave":
			console.log("Disconnecting user from", data.name);
			var conn = users[data.name];
			conn.otherName = null;
			if (conn != null) {
				sendTo(conn, {
					type: "leave"
				});
			}
			break;
			default:
			sendTo(connection, {
				type: "error",
				message: "Unrecognized command: " + data.type
			});
			break;
		}
	});

	connection.on('close', function () {
		if (connection.name) {
			delete users[connection.name];
			if (connection.otherName) {
				console.log("Disconnecting user from",
					connection.otherName);
				var conn = users[connection.otherName];
				conn.otherName = null;
				if (conn != null) {
					sendTo(conn, {
						type: "leave"
					});
				}
			}
		}
	});

	connection.send('Hello World');
});

function sendTo(conn, message) {
	conn.send(JSON.stringify(message));
}

module.exports = server.listen(port, function() {
	console.log(`api running on port ${port}`);
});

    // server.listen(port);