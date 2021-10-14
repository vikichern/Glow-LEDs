import Cart from '../models/cart';
import { Promo } from '../models';
import { make_private_code } from '../util';

export default {
	findAll_carts_db: async (filter: any, sortOrder: any) => {
		try {
			return await Cart.find(filter).sort(sortOrder).populate('user');
		} catch (error) {
			console.log({ findAll_carts_db_error: error });
			throw new Error(error.message);
		}
	},
	findById_carts_db: async (id: string) => {
		try {
			return await Cart.findOne({ _id: id }).populate('user');
		} catch (error) {
			console.log({ findById_carts_db_error: error });
			throw new Error(error.message);
		}
	},
	findByUser_carts_db: async (user_id: string) => {
		try {
			return await Cart.findOne({ user: user_id }).populate('user');
		} catch (error) {
			console.log({ findById_carts_db_error: error });
			// throw new Error(error.message);
		}
	},
	create_carts_db: async (body: any) => {
		try {
			return await Cart.create(body);
		} catch (error) {
			console.log({ create_carts_db_error: error });
			throw new Error(error.message);
		}
	},
	update_carts_db: async (id: string, body: any) => {
		console.log({ id, body });
		try {
			const cart: any = await Cart.findOne({ _id: id });
			if (cart) {
				return await Cart.updateOne({ _id: id }, body);
			}
		} catch (error) {
			console.log({ update_carts_db_error: error });
			throw new Error(error.message);
		}
	},
	remove_carts_db: async (id: string) => {
		try {
			const cart: any = await Cart.findOne({ _id: id });
			if (cart) {
				return await Cart.updateOne({ _id: id }, { deleted: true });
			}
		} catch (error) {
			console.log({ remove_carts_db_error: error });
			throw new Error(error.message);
		}
	}
};
