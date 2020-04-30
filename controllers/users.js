const User = require('../models/User.js');

const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'movieratingapplicationsecretkey';

module.exports.controller = (app) => {
// add a new movie
app.post('/users/register', (req, res) => {
	const fullname = req.body.fullname;
	const pseudo = req.body.pseudo;
	const email = req.body.email;
	const password = req.body.password;
	const newUser = new User({
		fullname,
		pseudo,
		email,
		password,
	});
	User.createUser(newUser, (error, user) => {
		if(error && error.code === 11000){
			return res.status(422).json({
				message: `Le pseudo ${pseudo} existe deja`,
			});
		}
		res.send({user: {pseudo: user.pseudo, fullname: user.fullname} });
	});
});

// login a user
// app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login' }), (req, res) => {
// 	if (req.body.email && req.body.password) {
// 		const email = req.body.email;
// 		const password = req.body.password;
// 		User.getUserByEmail(email, (err, user) => {
// 			if (!user) {
// 				return res.status(404).json({ message: 'The user does not exist!' });
// 			} else {
// 				User.comparePassword(password, user.password, (error, isMatch) =>
// 				{
// 					if (error) throw error;
// 					if (isMatch) {
// 						const payload = { id: user.id };
// 						const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn:3000 });
// 						res.json({ token: token, message: 'OK', current_user: { id: user._id, fullname: user.fullname, pseudo: user.pseudo, email: user.email } });
// 					} else {
// 						return res.status(401).json({ message: 'The password is incorrect!'
// 					});
// 					}
// 				});
// 			}
// 		});
// 	}
// });

app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login' }),
 (req, res) => {
 	res.redirect('/');
});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user){
		done(err, user)
	})
});

// app.get('/video_chat', passport.authenticate('jwt', { session: false }), (req, res) => {
//  res.send({ message: 'Welcome to Your Vue.js App 2' }) 
// });

app.get('/video_chat', (req, res) => {
	User.find({}, 'name description release_year genre', (error,
		users) => {
		if (error) { console.log(error); }
		res.send({
			message: 'Welcome to Your Vue.js App 2'
		});
	});
});

};