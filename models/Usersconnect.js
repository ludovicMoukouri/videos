const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const UsersConnectSchema = new Schema({
	fullname: String,
	email:String
});

const UsersConnect = mongoose.model('Userconnect', UsersConnectSchema);
module.exports = UsersConnect;

module.exports.createUserConnect = (newUserconnect, callback) => {
			// store the hashed password
			newUserconnect.save(callback);
};

module.exports.getUserConnectByEmail = (email, callback) => {
	const query = { email };
	UsersConnect.findOne(query, callback);
};