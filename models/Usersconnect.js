const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const UsersconnectSchema = new Schema({
	fullname: String,
	email:String
});

const Usersconnect = mongoose.model('Usersconnect', UsersconnectSchema);
module.exports = Usersconnect;

module.exports.createUserConnect = (newUserconnect, callback) => {
			// store the hashed password
			newUserconnect.save(callback);
};

module.exports.getUserConnectByEmail = (email, callback) => {
	const query = { email };
	Usersconnect.findOne(query, callback);
};