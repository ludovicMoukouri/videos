const User = require('../models/User.js');
const passport = require('passport');
const config = require('./../config/Config');
const Strategy = require('passport-facebook').Strategy;
module.exports.controller = (app) => {

// facebook strategy
passport.use(new Strategy({
	clientID: config.FACEBOOK_APP_ID,
	clientSecret: config.FACEBOOK_APP_SECRET,
	callbackURL: '/login/facebook/return',
	profileFields: ['id', 'displayName', 'email']
},
(accessToken, refreshToken, profile, cb) => {
	// Handle facebook login
	const email = profile.emails[0].value;
	User.getUserByEmail(email, (err, user) => {
		if (!user) {
			const newUser = new User({
				fullname: profile.displayName,
				email,
				facebookId: profile.id,
			});
			User.createUser(newUser, (error, user) => {
				if (error) {
					// Handle error
				}
				return cb(null, user);
			});
		} else {
			return cb(null, user);
		}
		return true;
	});
}));

app.get('/login/facebook',
	passport.authenticate('facebook', { scope: ['email'] }));
app.get('/login/facebook/return',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	(req, res) => {
		res.redirect('/video');
	});

	passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user){
		done(err, user)
	})
});
}