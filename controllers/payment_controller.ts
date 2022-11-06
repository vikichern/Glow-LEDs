import { Order } from "../models";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

export default {
  secure_pay_payments_c: async (req: any, res: any) => {
    try {
      const order = await Order.findById(req.params.id).populate("user");
      await stripe.paymentIntents.create(
        {
          amount: (order.totalPrice * 100).toFixed(0),
          currency: "usd",
          payment_method_types: ["card"]
        },
        async (err: any, result: any) => {
          if (err) {
            return res.status(500).send({
              error: err,
              message: err.raw.message,
              solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
            });
          } else {
            await stripe.paymentIntents.confirm(
              result.id,
              {
                payment_method: req.body.paymentMethod.id
              },
              async (err: any, result: any) => {
                if (err) {
                  return res.status(500).send({
                    error: err,
                    message: err.raw.message,
                    solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
                  });
                } else {
                  order.isPaid = true;
                  order.paidAt = Date.now();
                  order.payment = {
                    paymentMethod: "stripe",
                    charge: result,
                    payment: req.body.paymentMethod
                  };

                  const updatedOrder = await order.save();
                  // stripe.customers.create({
                  // 	address: {
                  // 		city: order.shipping.city,
                  // 		country: order.shipping.country,
                  // 		line1: order.shipping.address_1,
                  // 		line2: order.shipping.address_2,
                  // 		postal_code: order.shipping.postalCode,
                  // 		state: order.shipping.state
                  // 	},
                  // 	email: order.shipping.email,
                  // 	description: 'My First Test Customer (created for API docs)',
                  // 	name: order.shipping.first_name + ' ' + order.shipping.last_name,
                  // 	payment_method: req.body.paymentMethod.id,
                  // 	shipping: {
                  // 		address: {
                  // 			city: order.shipping.city,
                  // 			country: order.shipping.country,
                  // 			line1: order.shipping.address_1,
                  // 			line2: order.shipping.address_2,
                  // 			postal_code: order.shipping.postalCode,
                  // 			state: order.shipping.state
                  // 		},
                  // 		name: order.shipping.first_name + ' ' + order.shipping.last_name
                  // 	}
                  // });
                  if (updatedOrder) {
                    res.send({ message: "Order Paid.", order: updatedOrder });
                  } else {
                    return res.status(500).send({
                      error: err,
                      message: "Error Saving Payment",
                      solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
                    });
                  }
                }
              }
            );
          }
        }
      );
    } catch (error) {
      res.status(500).send({
        error,
        message: "Error Paying for Order",
        solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
      });
    }
  },
  guest_pay_payments_c: async (req: any, res: any) => {
    try {
      const order = await Order.findById(req.params.id);
      await stripe.paymentIntents.create(
        {
          amount: (order.totalPrice * 100).toFixed(0),
          currency: "usd",
          payment_method_types: ["card"]
        },
        async (err: any, result: any) => {
          if (err) {
            return res.status(500).send({
              error: err,
              message: err.raw.message,
              solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
            });
          } else {
            await stripe.paymentIntents.confirm(
              result.id,
              {
                payment_method: req.body.paymentMethod.id
              },
              async (err: any, result: any) => {
                if (err) {
                  return res.status(500).send({
                    error: err,
                    message: err.raw.message,
                    solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
                  });
                } else {
                  order.isPaid = true;
                  order.paidAt = Date.now();
                  order.payment = {
                    paymentMethod: "stripe",
                    charge: result,
                    payment: req.body.paymentMethod
                  };
                  const updatedOrder = await order.save();
                  // stripe.customers.create({
                  // 	address: {
                  // 		city: order.shipping.city,
                  // 		country: order.shipping.country,
                  // 		line1: order.shipping.address_1,
                  // 		line2: order.shipping.address_2,
                  // 		postal_code: order.shipping.postalCode,
                  // 		state: order.shipping.state
                  // 	},
                  // 	email: order.shipping.email,
                  // 	description: 'My First Test Customer (created for API docs)',
                  // 	name: order.shipping.first_name + ' ' + order.shipping.last_name,
                  // 	payment_method: req.body.paymentMethod.id,
                  // 	shipping: {
                  // 		address: {
                  // 			city: order.shipping.city,
                  // 			country: order.shipping.country,
                  // 			line1: order.shipping.address_1,
                  // 			line2: order.shipping.address_2,
                  // 			postal_code: order.shipping.postalCode,
                  // 			state: order.shipping.state
                  // 		},
                  // 		name: order.shipping.first_name + ' ' + order.shipping.last_name
                  // 	}
                  // });
                  if (updatedOrder) {
                    res.send({ message: "Order Paid.", order: updatedOrder });
                  } else {
                    return res.status(500).send({
                      error: err,
                      message: "Error Saving Payment",
                      solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
                    });
                  }
                }
              }
            );
          }
        }
      );
    } catch (error) {
      res.status(500).send({
        error,
        message: "Error Paying for Order",
        solution: "Please Try a Different Card if Error Persists and Contact Glow LEDs for Support"
      });
    }
  },
  secure_refund_payments_c: async (req: any, res: any) => {
    try {
      //
      const order = await Order.findById(req.params.id);
      const refund = await stripe.refunds.create({
        payment_intent: order.payment.charge.id,
        amount: (parseFloat(req.body.refund_amount) * 100).toFixed(0)
      });

      if (refund) {
        order.isRefunded = true;
        order.refundedAt = Date.now();
        order.payment = {
          paymentMethod: order.payment.paymentMethod,
          charge: order.payment.charge,
          refund: [...order.payment.refund, refund],
          refund_reason: [...order.payment.refund_reason, req.body.refund_reason]
        };
        const updated = await Order.updateOne({ _id: req.params.id }, order);

        if (updated) {
          res.send(order);
        } else {
          res.status(404).send({ message: "Order not Updated." });
        }
      } else {
        res.status(500).send({ message: "Refund not Created" });
      }
    } catch (error) {
      res.status(500).send({ error, message: "Error Refunding Order" });
    }
  }
  // payout_account_creation: async (req: any, res: any) => {
  //   try {
  //     const account = await stripe.accounts.create({type: 'express'});

  //     const accountLink = await stripe.accountLinks.create({
  //       account: 'acct_1032D82eZvKYlo2C',
  //       refresh_url: 'https://example.com/reauth',
  //       return_url: 'https://example.com/return',
  //       type: 'account_onboarding',
  //     });
  //   } catch (error) {
  //
  //     res.status(500).send({ error, message: "Error Refunding Order" });
  //   }
  // },
};

// import { payment_services } from '../services';

// export default {
// 	secure_pay_payments_c: async (req: any, res: any) => {
// 		const { params, body } = req;
// 		try {
// 			const payment = await payment_services.secure_pay_payments_s(params, body);
// 			if (payment) {
// 				return res.status(200).send(payment);
// 			}
// 			return res.status(500).send({ message: 'Error Updating Chip' });
// 		} catch (error) {
//
// 			res.status(500).send({ error, message: 'Error Updating Chip' });
// 		}
// 	},
// 	guest_pay_payments_c: async (req: any, res: any) => {
// 		const { params, body } = req;
// 		try {
// 			const payment = await payment_services.guest_pay_payments_s(params, body);
// 			if (payment) {
// 				return res.status(200).send(payment);
// 			}
// 			return res.status(500).send({ message: 'Error Updating Chip' });
// 		} catch (error) {
//
// 			res.status(500).send({ error, message: 'Error Updating Chip' });
// 		}
// 	},
// 	secure_refund_payments_c: async (req: any, res: any) => {
// 		const { params, body } = req;
// 		try {
// 			const payment = await payment_services.secure_refund_payments_s(params, body);
// 			if (payment) {
// 				return res.status(200).send(payment);
// 			}
// 			return res.status(500).send({ message: 'Error Updating Chip' });
// 		} catch (error) {
//
// 			res.status(500).send({ error, message: 'Error Updating Chip' });
// 		}
// 	}
// };
