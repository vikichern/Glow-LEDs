import { order_db } from "../db";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

export default {
  secure_pay_payments_s: async (params: any, body: any) => {
    try {
      const order = await order_db.findById_orders_db(params.id);
      await stripe.paymentIntents.create(
        {
          amount: (order.totalPrice * 100).toFixed(0),
          currency: "usd",
          payment_method_types: ["card"]
        },
        async (err: any, result: any) => {
          if (err) {
            return {
              error: err,
              message: err.raw.message,
              solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
            };
          } else {
            await stripe.paymentIntents.confirm(
              result.id,
              {
                payment_method: process.env.NODE_ENV === "production" ? body.paymentMethod.id : "pm_card_" + body.paymentMethod.card.brand
              },
              async (err: any, result: any) => {
                if (err) {
                  return {
                    error: err,
                    message: err.raw.message,
                    solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
                  };
                } else {
                  order.isPaid = true;
                  order.paidAt = Date.now();
                  order.payment = {
                    paymentMethod: "stripe",
                    charge: result,
                    payment: body.paymentMethod
                  };

                  const updatedOrder = await order.save();
                  if (updatedOrder) {
                    return { message: "Order Paid.", order: updatedOrder };
                  } else {
                    return {
                      error: err,
                      message: "Error Saving Payment",
                      solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
                    };
                  }
                }
              }
            );
          }
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  // guest_pay_payments_s: async (params: any, body: any) => {
  // 	try {
  // 		return await order_db.update_payments_db(params.id, body);
  // 	} catch (error) {
  //
  // // 		if (error instanceof Error) {
  //             throw new Error(error.message);
  //           }
  // 	}
  // },
  // secure_refund_payments_s: async (params: any, body: any) => {
  // 	try {
  // 		return await order_db.update_payments_db(params.id, body);
  // 	} catch (error) {
  //
  // // 		if (error instanceof Error) {
  //             throw new Error(error.message);
  //           }
  // 	}
  // },
};

// import { Order } from '../models';
// require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_KEY);

// export default {
// 	secure_pay: async (req: any, res: any) => {
// 		try {
// 		} catch (error) {
//
// 			res.status(500).send({
// 				error,
// 				message: 'Error Paying for Order',
// 				solution: 'Please Try a Different Card if Error Persists and Contact Glow LEDs for Support'
// 			});
// 		}
// 	},
// 	guest_pay: async (req: any, res: any) => {
// 		try {
// 			const order = await Order.findById(req.params.id);
// 			await stripe.paymentIntents.create(
// 				{
// 					amount: (order.totalPrice * 100).toFixed(0),
// 					currency: 'usd',
// 					payment_method_types: [ 'card' ]
// 				},
// 				async (err: any, result: any) => {
// 					if (err) {
//
// 						return res.status(500).send({
// 							error: err,
// 							message: err.raw.message,
// 							solution: 'Please Try a Different Card if Error Persists and Contact Glow LEDs for Support'
// 						});
// 					} else {
// 						await stripe.paymentIntents.confirm(
// 							result.id,
// 							{
// 								payment_method:
// 									process.env.NODE_ENV === 'production'
// 										? req.body.paymentMethod.id
// 										: 'pm_card_' + req.body.paymentMethod.card.brand
// 							},
// 							async (err: any, result: any) => {
// 								if (err) {
// 									return res.status(500).send({
// 										error: err,
// 										message: err.raw.message,
// 										solution:
// 											'Please Try a Different Card if Error Persists and Contact Glow LEDs for Support'
// 									});
// 								} else {
// 									order.isPaid = true;
// 									order.paidAt = Date.now();
// 									order.payment = {
// 										paymentMethod: 'stripe',
// 										charge: result,
// 										payment: req.body.paymentMethod
// 									};
// 									const updatedOrder = await order.save();
// 									if (updatedOrder) {
// 										res.send({ message: 'Order Paid.', order: updatedOrder });
// 									} else {
// 										return res.status(500).send({
// 											error: err,
// 											message: 'Error Saving Payment',
// 											solution:
// 												'Please Try a Different Card if Error Persists and Contact Glow LEDs for Support'
// 										});
// 									}
// 								}
// 							}
// 						);
// 					}
// 				}
// 			);
// 		} catch (error) {
//
// 			res.status(500).send({
// 				error,
// 				message: 'Error Paying for Order',
// 				solution: 'Please Try a Different Card if Error Persists and Contact Glow LEDs for Support'
// 			});
// 		}
// 	},
// 	secure_refund: async (req: any, res: any) => {
// 		try {
// 			//
// 			const order = await Order.findById(req.params.id);
// 			const refund = await stripe.refunds.create({
// 				payment_intent: order.payment.charge.id,
// 				amount: (parseFloat(req.body.refund_amount) * 100).toFixed(0)
// 			});
//
// 			if (refund) {
// 				order.isRefunded = true;
// 				order.refundedAt = Date.now();
// 				order.payment = {
// 					paymentMethod: order.payment.paymentMethod,
// 					charge: order.payment.charge,
// 					refund: [ ...order.payment.refund, refund ],
// 					refund_reason: [ ...order.payment.refund_reason, req.body.refund_reason ]
// 				};
// 				const updated = await Order.updateOne({ _id: req.params.id }, order);
//
// 				if (updated) {
// 					res.send(updated);
// 				} else {
// 					res.status(404).send({ message: 'Order not Updated.' });
// 				}
// 			} else {
// 				res.status(500).send({ message: 'Refund not Created' });
// 			}
// 		} catch (error) {
//
// 			res.status(500).send({ error, message: 'Error Refunding Order' });
// 		}
// 	}
// };
