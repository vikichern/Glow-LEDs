export {};
import jwt from 'jsonwebtoken';
const config = require('./config');
import { Request } from 'express';
import Log from './models/log';
import nodemailer from 'nodemailer';
import App from './email_templates/App';
import { error } from './email_templates/pages';
export interface IGetUserAuthInfoRequest extends Request {
	user: any; // or any other type
}

export const getToken = (user: any) => {
	// const payload = {
	// 	_id: user.id,
	// 	first_name: user.first_name,
	// 	last_name: user.last_name,
	// 	email: user.email,
	// 	affiliate: user.affiliate,
	// 	email_subscription: user.email_subscription,
	// 	is_affiliated: user.is_affiliated,
	// 	isVerified: user.isVerified,
	// 	isAdmin: user.isAdmin,
	// 	shipping: user.shipping
	// };

	// return jwt.sign(
	// 	payload,
	// 	config.JWT_SECRET,
	// 	{
	// 		expiresIn: 31556926 // 1 year in seconds
	// 	},
	// 	(err, token) => {
	// 		return {
	// 			success: true,
	// 			token: 'Bearer ' + token
	// 		};
	// 	}
	// );

	return jwt.sign(
		{
			_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			password: user.password,
			isAdmin: user.isAdmin,
			isVerified: user.isVerified,
			affiliate: user.affiliate,
			email_subscription: user.email_subscription,
			shipping: user.shipping,
			is_affiliated: user.is_affiliated
		},
		config.JWT_SECRET,
		{
			expiresIn: '48h' // 1 year in seconds
		}
	);
};

export const isAuth = (
	req: { headers: { authorization: any }; user: any },
	res: { status: (arg0: number) => { (): any; new (): any; send: { (arg0: { msg: string }): any; new (): any } } },
	next: () => void
) => {
	const token = req.headers.authorization;

	if (token) {
		const onlyToken = token.slice(7, token.length);
		jwt.verify(onlyToken, config.JWT_SECRET, (err: any, decode: any) => {
			if (err) {
				return res.status(401).send({ msg: 'Invalid Token' });
			}
			req.user = decode;
			next();
			return;
		});
	} else {
		return res.status(401).send({ msg: 'Token is not supplied.' });
	}
};

export const isAdmin = (
	req: { user: { isAdmin: any } },
	res: { status: (arg0: number) => { (): any; new (): any; send: { (arg0: { msg: string }): any; new (): any } } },
	next: () => any
) => {
	// console.log(req.user);
	if (req.user && req.user.isAdmin) {
		return next();
	}
	return res.status(401).send({ msg: 'Admin Token is not valid.' });
};

export const log_request = async (logs: any) => {
	await Log.create({
		method: logs.method,
		path: logs.path,
		file: `${logs.collection.toLowerCase()}_routes`,
		status: logs.status,
		success: logs.success,
		ip: logs.ip,
		outcome: `${logs.success
			? `Successfully Completed ${logs.method} Request for`
			: `Unsuccessfully Completed ${logs.method} Request for`} ${logs.data.length} ${logs.collection}s`
	});
};
let transporter = nodemailer.createTransport({
	service: 'gmail',
	pool: true,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
});

export const log_error = async (logs: any) => {
	const data = {
		method: logs.method,
		path: logs.path,
		error: logs.error,
		status: logs.status,
		success: logs.success,
		file: `${logs.collection.toLowerCase()}_routes`,
		outcome: `Error Completing ${logs.method} Request for ${logs.collection}s`
	};

	await Log.create(data);

	let mailOptions = {
		from: process.env.DISPLAY_EMAIL,
		to: 'info.glowleds@gmail.com',
		subject: data.outcome,
		html: App({ body: error(data), title: `Log Error: ${data.outcome}` })
	};

	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			console.log('Error Occurs', err);
		} else {
			console.log('Error Email Sent');
		}
	});
};

export const make_private_code = (length: any) => {
	const result = [];
	const characters = 'abcdefghijklmnopqrstuvwxyz';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join('');
};
