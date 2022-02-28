const jwt = require('jsonwebtoken');
const user = require('../../models/dummyUser');

module.exports = (app) => {
	app.post('/user/register', (req, res, next) => {
		const { body } = req;

		console.log(body);

		console.log('Successfully created user account.');

		user.push(body);

		console.log('user');
		console.log(user);

		jwt.sign({ user: body }, 'privatekey', { expiresIn: '1h' }, (err, token) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.json({
				message : 'Successful log in',
				token
			});
		});
	});

	app.post('/user/login', (req, res, next) => {
		const { body } = req;
		const { email } = body;
		const { password } = body;

		console.log(email);
		console.log(user.username);

		console.log(email);
		console.log(user.username);

		console.log(email === user.username && password === user.password);

		let userBeingChecked = user.find((user) => user.username == email);

		//checking to make sure the user entered the correct username/password combo
		if (email === userBeingChecked.username && password === userBeingChecked.password) {
			//if user log in success, generate a JWT token for the user with a secret key
			console.log('email and password are correct::::::Signing jwt token');
			jwt.sign({ user: userBeingChecked }, 'privatekey', { expiresIn: '1h' }, (err, token) => {
				if (err) {
					console.log(err);
				}
				res.json({
					message : 'Successful log in',
					token
				});
			});
		} else {
			console.log('ERROR: Could not log in');
			res.send(null);
		}
	});

	//This is a protected route
	app.get('/user/orders', checkToken, (req, res) => {
		//verify the JWT token generated for the user
		jwt.verify(req.token, 'privatekey', (err, authorizedData) => {
			if (err) {
				//If error send Forbidden (403)
				console.log('ERROR: Could not connect to the protected route');
				res.sendStatus(403);
			} else {
				//If token is successfully verified, we can send the autorized data
				res.json({
					message        : 'Properly Authenticated with JWT',
					authorizedData,
					orders         : [ 1, 2, 3 ]
				});
				console.log('SUCCESS: Connected to protected route');
			}
		});
	});
};

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
	const header = req.headers['authorization'];

	if (typeof header !== 'undefined') {
		const bearer = header.split(' ');
		const token = bearer[1];

		req.token = token;

		next();
	} else {
		//If header is undefined return Forbidden (403)
		res.sendStatus(403);
	}
};
