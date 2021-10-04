import Chip from '../models/chip';
import { Promo } from '../models';
import { make_private_code } from '../util';

export default {
	findAll_chips_db: async (searchKeyword: any, sortOrder: any) => {
		try {
			return await Chip.find({
				deleted: false,
				...searchKeyword
			})
				.sort(sortOrder)
				.populate('user');
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	findById_chips_db: async (id: string) => {
		try {
			return await Chip.findOne({ _id: id }).populate('user');
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	create_chips_db: async (body: any) => {
		try {
			return await Chip.create(body);
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	update_chips_db: async (id: string, body: any) => {
		try {
			const chip: any = await Chip.findOne({ _id: id });
			if (chip) {
				return await Chip.updateOne({ _id: id }, body);
			}
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	},
	remove_chips_db: async (id: string) => {
		try {
			const chip: any = await Chip.findOne({ _id: id });
			if (chip) {
				return await Chip.updateOne({ _id: id }, { deleted: true });
			}
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	}
};
