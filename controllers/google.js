const User = require('../models/User');
const passport = require('passport');
const config = require('./../config/Config');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
module.exports.controller = (app) => {

	// google strategy
	passport.use(new GoogleStrategy({
		clientID: config.GOOGLE_APP_ID,
		clientSecret: config.GOOGLE_APP_SECRET,
		callbackURL: 'https://v-video.herokuapp.com/login/google/return'
	},
	(accessToken, refreshToken , profile, cb) => {
		const email = profile.emails[0].value;
		console.log(profile)
			User.getUserByEmail(email, (err, user) => {
				if (!user) {
					const newUser = new User({
						fullname: profile.displayName,
						email,
						// facebookId: profile.id
					});
					User.createUser(newUser, (error, newUser) => {
						if (error) {
						// Handle error
					}
					return cb(null, newUser);
				});
				} else {
					return cb(null, user);
				}
				return true;
			});
	}));
	app.get('/login/google',
	passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get('/login/google/return',
	passport.authenticate('google', { failureRedirect: '/login' }),
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
};