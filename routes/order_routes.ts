// import express from 'express';
// import Order from '../models/orderModel';
// import { isAuth, isAdmin } from '../util';
export {};
const express = require('express');
import e from 'express';
import { Log, User } from '../models';
import Order from '../models/order';
import { log_error, log_request } from '../util';
const { isAuth, isAdmin } = require('../util');
require('dotenv').config();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

const router = express.Router();

// router.get('/', isAuth, async (req: any, res: { send: (arg0: any) => void }) => {
// 	const orders = await Order.find({ deleted: false }).populate('user').sort({ createdAt: -1 });
// 	res.send(orders);
// });

router.get('/occurrences', async (req: any, res: any) => {
	const orders = await Order.find({ deleted: false }).populate('orderItems.secondary_product');
	const products: any = [];
	orders.forEach((order: any) => {
		order.orderItems.map((item: any) => {
			products.push(item.name);
			if (item.secondary_product) {
				products.push(item.secondary_product.name);
			}
		});
	});
	let result: any = {};
	for (var i = 0; i < products.length; ++i) {
		if (!result[products[i]]) {
			result[products[i]] = 0;
		}
		++result[products[i]];
	}
	let final_result = [];
	for (let i in result) {
		const entry = { name: i, occurrence: result[i] };
		final_result.push(entry);
	}
	final_result.sort((a, b) => (a.occurrence > b.occurrence ? -1 : 1));
	res.send(final_result);
});

router.get('/', isAuth, async (req: any, res: any) => {
	try {
		const category = req.query.category ? { category: req.query.category } : {};
		let user: any;
		let searchKeyword: any;
		if (req.query.searchKeyword) {
			const userSearchKeyword = req.query.searchKeyword
				? {
						first_name: {
							$regex: req.query.searchKeyword,
							$options: 'i'
						}
					}
				: {};
			console.log({ userSearchKeyword });
			user = await User.findOne({ ...userSearchKeyword });
			console.log({ user });
			searchKeyword = { user: user._id };
		}
		let sortOrder = {};
		if (req.query.sortOrder === 'lowest') {
			sortOrder = { totalPrice: 1 };
		} else if (req.query.sortOrder === 'highest') {
			sortOrder = { totalPrice: -1 };
		} else if (req.query.sortOrder === 'date' || req.query.sortOrder === '') {
			sortOrder = { createdAt: 1 };
		} else if (req.query.sortOrder === 'paid') {
			sortOrder = { isPaid: -1, createdAt: -1 };
		} else if (req.query.sortOrder === 'manufactured') {
			sortOrder = { isManufactured: -1, createdAt: -1 };
		} else if (req.query.sortOrder === 'packaged') {
			sortOrder = { isPackaged: -1, createdAt: -1 };
		} else if (req.query.sortOrder === 'shipped') {
			sortOrder = { isShipped: -1, createdAt: -1 };
		} else if (req.query.sortOrder === 'delivered') {
			sortOrder = { isDelivered: -1, createdAt: -1 };
		}
		console.log({ searchKeyword });
		const orders = await Order.find({ deleted: false, ...category, ...searchKeyword })
			.populate('user')
			.populate('orderItems.product')
			.populate('orderItems.secondary_product')
			.sort(sortOrder);
		log_request({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			data: orders,
			status: 200,
			success: true,
			ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		res.send(orders);
	} catch (error) {
		log_error({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Getting Orders' });
	}
});
router.get('/daily_income', async (req: any, res: any) => {
	try {
		const orders = await Order.find({
			deleted: false,
			createdAt: {
				$gte: new Date(<any>new Date() - 1 * 60 * 60 * 24 * 1000)
			}
		});
		console.log({ orders });
		log_request({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			data: orders,
			status: 200,
			success: true,
			ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		res.json(orders);
	} catch (error) {
		log_error({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Getting Orders' });
	}
});
router.get('/weekly_income', async (req: any, res: any) => {
	try {
		const orders = await Order.find({
			deleted: false,
			createdAt: {
				$gte: new Date(<any>new Date() - 7 * 60 * 60 * 24 * 1000)
			}
		});
		console.log({ orders });
		log_request({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			data: orders,
			status: 200,
			success: true,
			ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		res.json(orders);
	} catch (error) {
		log_error({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Getting Orders' });
	}
});
router.get('/monthly_income', async (req: any, res: any) => {
	try {
		const orders = await Order.find({
			deleted: false,
			createdAt: {
				$gte: new Date(<any>new Date() - 30 * 60 * 60 * 24 * 1000)
			}
		});
		console.log({ orders });
		log_request({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			data: orders,
			status: 200,
			success: true,
			ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		res.json(orders);
	} catch (error) {
		log_error({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Product',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Getting Orders' });
	}
});

router.get('/mine', isAuth, async (req: any, res: any) => {
	try {
		const orders = await Order.find({ deleted: false, user: req.user._id }).sort({ _id: -1 });
		log_request({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Order',
			data: orders,
			status: 200,
			success: true,
			ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		res.send(orders);
	} catch (error) {
		log_error({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Getting Your Orders' });
	}
});

router.get('/:id', isAuth, async (req: any, res: any) => {
	try {
		const order = await Order.findOne({ _id: req.params.id })
			.populate('orderItems.product')
			.populate('orderItems.secondary_product')
			.populate('user');
		if (order) {
			log_request({
				method: 'GET',
				path: req.originalUrl,
				collection: 'Order',
				data: order,
				status: 200,
				success: true,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.send(order);
		} else {
			log_request({
				method: 'GET',
				path: req.originalUrl,
				collection: 'Order',
				data: order,
				status: 404,
				success: false,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.status(404).send('Order Not Found.');
		}
	} catch (error) {
		log_error({
			method: 'GET',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Getting Order' });
	}
});

router.delete('/:id', isAuth, isAdmin, async (req: any, res: any) => {
	try {
		const message: any = { message: 'Order Deleted' };
		const deleted_order = await Order.updateOne({ _id: req.params.id }, { deleted: true });
		if (deleted_order) {
			log_request({
				method: 'DELETE',
				path: req.originalUrl,
				collection: 'Order',
				data: [ deleted_order ],
				status: 200,
				success: true,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.send(message);
		} else {
			log_request({
				method: 'DELETE',
				path: req.originalUrl,
				collection: 'Order',
				data: [ deleted_order ],
				status: 500,
				success: false,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.send('Error in Deletion.');
		}
	} catch (error) {
		log_error({
			method: 'DELETE',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Deleting Order' });
	}
});

router.post('/', isAuth, async (req: any, res: any) => {
	try {
		const newOrder = new Order({
			orderItems: req.body.orderItems,
			user: req.body.user ? req.body.user._id : req.user._id,
			shipping: req.body.shipping,
			payment: req.body.payment,
			itemsPrice: req.body.itemsPrice,
			taxPrice: req.body.taxPrice,
			shippingPrice: req.body.shippingPrice,
			totalPrice: req.body.totalPrice,
			order_note: req.body.order_note,
			promo_code: req.body.promo_code,
			deleted: false
		});
		console.log({ user: req.user });
		console.log({ user: req.body.user });
		const newOrderCreated = await newOrder.save();
		console.log({ newOrderCreated });

		if (newOrderCreated) {
			log_request({
				method: 'POST',
				path: req.originalUrl,
				collection: 'Order',
				data: [ newOrderCreated ],
				status: 201,
				success: true,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.status(201).send({ message: 'New Order Created', data: newOrderCreated });
		} else {
			log_request({
				method: 'POST',
				path: req.originalUrl,
				collection: 'Order',
				data: [ newOrderCreated ],
				status: 500,
				success: false,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			return res.status(500).send({ message: ' Error in Creating Order.' });
		}
	} catch (error) {
		log_error({
			method: 'POST',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Creating Order' });
	}
});

// router.put('/charges', async (req: { user: { _id: any } }, res: { send: (arg0: any) => void }) => {
// 	const order = await Order.findById('5f88c4c6d82e0e002acae9bf').populate('user');
// 	// const charges = await stripe.charges.list({});
// 	const charge = await stripe.charges.retrieve('ch_1HceYpJUIKBwBp0w69pyljh3');
// 	order.payment = {
// 		paymentMethod: 'stripe',
// 		charge: charge
// 	};
// 	const updatedOrder = await order.save();
// 	res.send(updatedOrder);
// });

// router.put('/update_charge_email', async (req: { user: { _id: any } }, res: { send: (arg0: any) => void }) => {
// 	const charge = await stripe.charges.update('ch_1HhimVJUIKBwBp0wgil79u96', {
// 		metadata: { receipt_email: 'ssdaly1590@gmail.com' }
// 	});

// 	res.send(charge);
// });
// router.get('/refunds', async (req: { user: { _id: any } }, res: { send: (arg0: any) => void }) => {
// 	const refunds = await stripe.refunds.list({});
// 	res.send(refunds);
// });

router.put('/:id/pay', isAuth, async (req: any, res: any) => {
	try {
		const order = await Order.findById(req.params.id).populate('user');
		console.log({ order });

		// setTimeout(() => {
		// 	console.log({ message: 'Error Paying for Order' });
		// 	// return res.status(500).send({ message: 'Error Paying for Order' });
		// }, 5000);
		const charge = await stripe.charges.create(
			{
				amount: (order.totalPrice * 100).toFixed(0),
				currency: 'usd',
				description: `Order Paid`,
				source: req.body.token.id
			},
			async (err: any, result: any) => {
				if (err) {
					console.log({ err });
					// return res.status(500).send({ error, message: 'Error Paying for Order' });
					log_error({
						method: 'PUT',
						path: req.originalUrl,
						collection: 'Order',
						error: err,
						status: 500,
						success: false,
						ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
					});
					return res.status(500).send({ error: err, message: err.raw.message });
				} else {
					console.log({ result });
					// if (charge) {
					log_request({
						method: 'PUT',
						path: req.originalUrl,
						collection: 'Order',
						data: [ result ],
						status: 201,
						success: true,
						ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
					});
					order.isPaid = true;
					order.paidAt = Date.now();
					order.payment = {
						paymentMethod: 'stripe',
						charge: result
					};
					const updatedOrder = await order.save();
					if (updatedOrder) {
						log_request({
							method: 'PUT',
							path: req.originalUrl,
							collection: 'Order',
							data: [ updatedOrder ],
							status: 201,
							success: true,
							ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
						});
						res.send({ message: 'Order Paid.', order: updatedOrder });
					}
					// }
				}
			}
		);
		// 4000000000000002
	} catch (error) {
		log_error({
			method: 'PUT',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Paying for Order' });
	}
});

router.post('/guestcheckout', async (req: any, res: any) => {
	try {
		// const newOrder = new Order({
		// 	orderItems: req.body.orderItems,
		// 	guest: true,
		// 	shipping: req.body.shipping,
		// 	payment: req.body.payment,
		// 	itemsPrice: req.body.itemsPrice,
		// 	taxPrice: req.body.taxPrice,
		// 	shippingPrice: req.body.shippingPrice,
		// 	totalPrice: req.body.totalPrice,
		// 	order_note: req.body.order_note,
		// 	promo_code: req.body.promo_code,
		// 	deleted: false
		// });
		// console.log({ newOrder });
		const newOrderCreated = await Order.create({ ...req.body, guest: true });
		// console.log({ user: req.body.user });
		// const newOrderCreated = await newOrder.save();
		console.log({ newOrderCreated });

		if (newOrderCreated) {
			log_request({
				method: 'POST',
				path: req.originalUrl,
				collection: 'Order',
				data: [ newOrderCreated ],
				status: 201,
				success: true,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.status(201).send({ message: 'New Order Created', newOrder: newOrderCreated });
		} else {
			log_request({
				method: 'POST',
				path: req.originalUrl,
				collection: 'Order',
				data: [ newOrderCreated ],
				status: 500,
				success: false,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			return res.status(500).send({ message: ' Error in Creating Order.' });
		}
	} catch (error) {
		log_error({
			method: 'POST',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Creating Order' });
	}
});

router.put('/guestcheckout/:id/pay', async (req: any, res: any) => {
	try {
		const order = await Order.findById(req.params.id);
		console.log({ '/guestcheckout/:id/pay': req.body });
		// console.log({ order });
		const charge = await stripe.charges.create(
			{
				amount: (order.totalPrice * 100).toFixed(0),
				currency: 'usd',
				description: `Order Paid`,
				source: req.body.token.id
			},
			async (err: any, result: any) => {
				if (err) {
					console.log({ err });
					log_error({
						method: 'PUT',
						path: req.originalUrl,
						collection: 'Order',
						error: err,
						status: 500,
						success: false,
						ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
					});
					return res.status(500).send({ error: err, message: err.raw.message });
				} else {
					console.log({ result });
					// if (charge) {
					log_request({
						method: 'PUT',
						path: req.originalUrl,
						collection: 'Order',
						data: [ result ],
						status: 201,
						success: true,
						ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
					});
					order.isPaid = true;
					order.paidAt = Date.now();
					order.payment = {
						paymentMethod: 'stripe',
						charge: result
					};
					const updatedOrder = await order.save();
					if (updatedOrder) {
						log_request({
							method: 'PUT',
							path: req.originalUrl,
							collection: 'Order',
							data: [ updatedOrder ],
							status: 201,
							success: true,
							ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
						});
						res.send({ message: 'Order Paid.', order: updatedOrder });
					}
					// }
				}
			}
		);
		// 4000000000000002
	} catch (error) {
		log_error({
			method: 'PUT',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Paying for Order' });
	}
});

router.put('/:id/refund', async (req: any, res: any) => {
	try {
		const order = await Order.findById(req.params.id);
		const refund = await stripe.refunds.create({
			charge: order.payment.charge.id,
			amount: req.body.refund_amount * 100
		});
		if (refund) {
			log_request({
				method: 'PUT',
				path: req.originalUrl,
				collection: 'Order',
				data: [ refund ],
				status: 201,
				success: true,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			order.isRefunded = true;
			order.refundedAt = Date.now();
			order.payment = {
				paymentMethod: order.payment.paymentMethod,
				charge: order.payment.charge,
				refund: [ ...order.payment.refund, refund ],
				refund_reason: [ ...order.payment.refund_reason, req.body.refund_reason ]
			};
			const updated = await Order.updateOne({ _id: req.params.id }, order);
			if (updated) {
				log_request({
					method: 'PUT',
					path: req.originalUrl,
					collection: 'Order',
					data: [ updated ],
					status: 201,
					success: true,
					ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
				});
				res.send(updated);
			} else {
				log_request({
					method: 'PUT',
					path: req.originalUrl,
					collection: 'Product',
					data: [ updated ],
					status: 404,
					success: false,
					ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
				});
				res.status(404).send({ message: 'Order not Updated.' });
			}
		}
	} catch (error) {
		log_error({
			method: 'PUT',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Refunding Order' });
	}
});

router.put('/addproduct', async (req: { body: any; params: { id: any } }, res: { send: (arg0: any) => void }) => {
	try {
		const order_id = req.body.order._id;
		const product_id = req.body.product;
		const order = await Order.findById(order_id)
			.populate('orderItems.product')
			.populate('orderItems.secondary_product')
			.populate('user');
		order.orderItems.product._id = product_id;
		const updated = await Order.updateOne({ _id: order_id }, order);
		res.send(updated);
	} catch (err) {
		console.log(err);
	}
});

router.put(
	'/addsecondaryproduct',
	async (req: { body: any; params: { id: any } }, res: { send: (arg0: any) => void }) => {
		try {
			const order_id = req.body.order._id;
			const product_id = req.body.secondary_product;
			const order = await Order.findById(order_id)
				.populate('orderItems.product')
				.populate('orderItems.secondary_product')
				.populate('user');
			for (let item of order.orderItems) {
				if (
					item.name === 'Mini Diffuser Caps + Adapters Starter Kit' ||
					item.name === 'Diffuser Caps + Adapters Starter Kit'
				) {
					item.secondary_product = product_id;
				}
			}
			console.log({ order });

			const updated = await Order.updateOne({ _id: order_id }, order);
			res.send(updated);
		} catch (err) {
			console.log(err);
		}
	}
);

router.put('/:id/update', async (req: any, res: any) => {
	try {
		const updated_order = req.body;
		console.log({ updated_order });
		const updated = await Order.updateOne({ _id: req.params.id }, updated_order);
		console.log({ updated });
		if (updated) {
			log_request({
				method: 'PUT',
				path: req.originalUrl,
				collection: 'Order',
				data: [ updated ],
				status: 201,
				success: true,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.send(updated_order);
		} else {
			log_request({
				method: 'PUT',
				path: req.originalUrl,
				collection: 'Product',
				data: [ updated ],
				status: 404,
				success: false,
				ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			res.status(404).send({ message: 'Order not Updated.' });
		}
	} catch (error) {
		log_error({
			method: 'PUT',
			path: req.originalUrl,
			collection: 'Order',
			error,
			status: 500,
			success: false
		});
		res.status(500).send({ error, message: 'Error Updating Order' });
	}
});

export default router;
