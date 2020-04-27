const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const session = require('express-session');
const config = require('./config/Config');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'movieratingapplicationsecretkey';

const ws = require('ws');

const app = express();

require('./passport')(passport);

var http = require('http');
var WebSocketServer = require('ws').Server
const router = express.Router();
const serveStatic = require('serve-static');

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS");
	next();
});

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
	secret: config.SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: { httpOnly: false }
}))

app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect('mongodb://localhost/video_chat', { useNewUrlParser: true, useUnifiedTopology: true }, function() {
	console.log('Connection has been made');
})
.catch(err => {
	console.error('App starting error:', err.stack);
	process.exit(1);
});

// Include controllers
fs.readdirSync("controllers").forEach(function (file) {
	if(file.substr(-3) == ".js") {
		const route = require("./controllers/" + file)
		route.controller(app)
	}
});

app.use(serveStatic(__dirname + "/dist"));

router.get('/api/current_user', isLoggedIn, function(req, res) {
	if(req.user) {
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

router.get('/', function(req, res) {
	res.json({ message: 'API Initialized!'});
});

const port = process.env.API_PORT || 8081;
app.use('/', router);
app.listen(port, function() {
	console.log(`api running on port ${port}`);
});

var server = http.createServer(app);

var wss = new WebSocketServer({ server: server});
wss.on('connection', function(ws) {
	console.log("connection");
	ws.on('message', function (message) {
		console.log("Bonjour");
	});
});

module.exports = server

    // server.listen(port);