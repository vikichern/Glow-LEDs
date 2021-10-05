import { User } from '../models';
import { getToken } from '../util';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');
require('dotenv');

export default {
	findAll_users_db: async (searchKeyword: any, category: any, sortOrder: any) => {
		try {
			return await User.find({
				deleted: false,
				...searchKeyword,
				...category
			})
				.sort(sortOrder)
				.populate('affiliate');
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	findById_users_db: async (id: string) => {
		try {
			return await User.findOne({ _id: id }).populate('affiliate');
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	findByEmail_users_db: async (email: string) => {
		try {
			return await User.findOne({ email }).populate('affiliate');
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	create_users_db: async (user: any) => {
		try {
			return await User.create(user);
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	update_users_db: async (id: string, body: any) => {
		try {
			const user: any = await User.findOne({ _id: id });
			if (user) {
				return await User.updateOne({ _id: id }, body);
			}
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	remove_users_db: async (id: string) => {
		try {
			const user: any = await User.findOne({ _id: id });
			if (user) {
				return await User.updateOne({ _id: id }, { deleted: true });
			}
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	}
};
