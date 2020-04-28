const UsersConnect = require('../models/Usersconnect.js');

module.exports.controller = (app) => {
	app.post('/users/usersConnect', (req, res) => {
		const fullname = req.body.fullname;
		const email = req.body.email;
		const newUsersConnect = new UsersConnect({
			fullname,
			email,
		});
		UsersConnect.createUserConnect(newUsersConnect, (error, user) => {
			if(error && error.code === 11000){
				return res.status(422).json({
					message: `La personne ${fullname} est deja connect`,
				});
			}
			res.send({user: {fullname: user.fullname, email: user.email} });
		});
	});

	app.get('/users/usersConnect/:email', (req, res) => {
			const email = 'ludovicmoukouri@yahoo.fr'
			UsersConnect.getUserConnectByEmail(email, (err, userConnect) =>{
				if(!userConnect) {
					return res.send({ userConnect: 'no user' })
				}
				res.send({userConnect: 'user exist' })
			})
		});

}