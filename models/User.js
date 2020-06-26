const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	pseudo: String,
	fullname: String,
	email:String,
	password: String,
	connected: { type: Boolean, default: false },
	active: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.createUser = (newUser, callback) => {
	bcryptjs.genSalt(10, (err, salt) => {
		bcryptjs.hash(newUser.password, salt, (error, hash) => {
			// store the hashed password
			const newUserResource = newUser;
			newUserResource.password = hash;
			newUserResource.save(callback);
		});
	});
};

module.exports.getUserByEmail = (email, callback) => {
	const query = { email };
	User.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
};

module.exports.UpdateById = (email, connected, callback) => {
	const query = { email };
	// User.findByIdAndUpdate(query.id, { $set: { connected: query.connected } }, callback);
	User.findOneAndUpdate(query, { $set: { connected: connected } }, callback);
};

// module.exports.findOne = (email, callback) => {
// 	const query = { email };
// 	User.findOne(query, callback);
// };