// React
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { determine_tracking_number, determnine_link, format_date } from '../../utils/helper_functions';
import { createOrder, deleteOrder, detailsOrder, listOrders } from '../../actions/orderActions';
import { LazyImage, Loading } from '../UtilityComponents';
import { determine_product_name } from '../../utils/react_helper_functions';
import { OrderStatusButtons } from './OrderPageComponents';
import { API_Orders, API_Shipping } from '../../utils';

const OrderListItem = ({ order, determine_color, admin, update_order_payment_state, update_order_state }) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [ loading_label, set_loading_label ] = useState(false);
	const [ hide_label_button, set_hide_label_button ] = useState(true);

	const show_hide = (id) => {
		const row = document.getElementById(id);
		// console.log(row);
		row.classList.toggle('hide-row');
	};
	const daysBetween = (date1, date2) => {
		const diffTime = Math.abs(new Date(date2) - date1);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays - 1;
	};

	const today = new Date();

	const sendEmail = (message) => {
		const email = order.shipping.email;
		const subject = 'Your Glow LEDs Order';
		const emailBody = 'Hi ' + order.user.first_name + ',';
		document.location = 'mailto:' + email + '?subject=' + subject + '&body=' + emailBody;
	};

	const create_duplicate_order = () => {
		console.log({ create_duplicate_order: order });
		console.log({ create_duplicate_order_user: order.user._id });
		// console.log({ user: order.user });
		dispatch(
			createOrder({
				orderItems: order.orderItems,
				shipping: { ...order.shipping, shipment_id: null, shipping_rate: null, shipping_label: null },
				itemsPrice: order.itemsPrice,
				shippingPrice: 0,
				taxPrice: 0,
				totalPrice: 0,
				user: order.user._id,
				order_note: `Replacement Order for ${order.shipping.first_name} ${order.shipping
					.last_name} - Original Order Number is ${order._id}`
			})
		);
		dispatch(listOrders({}));
	};

	const delete_order = () => {
		dispatch(deleteOrder(order._id));
		dispatch(listOrders({ limit: 10, page: 1 }));
	};

	const view_label = async () => {
		// show_label(order.shipping.shipping_label.postage_label.label_url);
		print_label(order.shipping.shipping_label.postage_label.label_url);
	};

	const print_label = (content) => {
		// const content = document.getElementById(id).innerHTML;
		const frame1 = document.createElement('iframe');
		frame1.name = 'frame1';
		frame1.style.position = 'absolute';
		frame1.style.top = '-1000000px';
		document.body.appendChild(frame1);
		const frameDoc = frame1.contentWindow
			? frame1.contentWindow
			: frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
		frameDoc.document.open();
		frameDoc.document.write('</head><body>');
		frameDoc.document.write(`<div style="width: 100%;
    display: flex;
    height: 100%;
    align-items: center;;">
        <img style="margin: auto; text-align: center;" src="${content}" alt="label" />
    </div>`);
		frameDoc.document.write('</body></html>');
		frameDoc.document.close();
		setTimeout(function() {
			window.frames['frame1'].focus();
			window.frames['frame1'].print();
			document.body.removeChild(frame1);
		}, 500);
		return false;
	};

	const get_invoice = async () => {
		const { data: invoice } = await API_Orders.get_invoice(order);
		console.log({ invoice });
		print_invoice(invoice);
	};

	const print_invoice = (contents) => {
		// const contents = document.getElementById(id).innerHTML;
		const frame1 = document.createElement('iframe');
		frame1.name = 'frame1';
		frame1.style.position = 'absolute';
		frame1.style.top = '-1000000px';
		document.body.appendChild(frame1);
		const frameDoc = frame1.contentWindow
			? frame1.contentWindow
			: frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
		frameDoc.document.open();
		frameDoc.document.write('</head><body>');
		frameDoc.document.write(contents);
		frameDoc.document.write('</body></html>');
		frameDoc.document.close();
		setTimeout(function() {
			window.frames['frame1'].focus();
			window.frames['frame1'].print();
			document.body.removeChild(frame1);
		}, 500);
		return false;
	};

	const buy_label = async () => {
		set_loading_label(true);
		console.log({ shipment_id: order.shipping.shipment_id, shipping_rate: order.shipping.shipping_rate });
		const { data } = await API_Shipping.buy_label(order.shipping.shipment_id, order.shipping.shipping_rate);
		const { data: invoice } = await API_Orders.get_invoice(order);
		// show_label(data.postage_label.label_url);
		print_label(data.postage_label.label_url);
		print_invoice(invoice);
		if (data) {
			set_loading_label(false);
		}
		console.log({ tracking_code: data.tracking_code });
		const request = await API_Shipping.add_tracking_number(order, data.tracking_code, data);
		console.log(request);
		// dispatch(detailsOrder(props.match.params.id));
		set_hide_label_button(false);
		dispatch(listOrders({}));
		// history.push('/secure/glow/emails/invoice/' + order._id);
		// history.push({
		// 	pathname: '/secure/glow/emails/invoice/' + order._id,
		// 	previous_path: props.location.previous_path
		// });
	};

	return (
		<div className="container" style={{ backgroundColor: determine_color(order) }}>
			<Loading loading={loading_label} />
			<div className="pb-15px mb-10px jc-b" style={{ borderBottom: '1px solid white' }}>
				<div className="w-60per jc-b ">
					<div className="fs-16px">
						<h3>Order Placed</h3>
						<div>{order.createdAt && format_date(order.createdAt)}</div>
					</div>
					<div className="fs-16px">
						<h3>Total</h3>
						{!order.isRefunded && (
							<div>
								<div>${order.totalPrice ? order.totalPrice.toFixed(2) : order.totalPrice}</div>
							</div>
						)}
						{order.isRefunded && (
							<div>
								<del style={{ color: 'red' }}>
									<label style={{ color: 'white' }}>
										<div>${order.totalPrice ? order.totalPrice.toFixed(2) : order.totalPrice}</div>
									</label>
								</del>
							</div>
						)}
						{order.isRefunded && (
							<div>
								<div>-${(order.payment.refund.reduce((a, c) => a + c.amount, 0) / 100).toFixed(2)}</div>
							</div>
						)}
						{order.isRefunded && (
							<div>
								<div>
									${(order.totalPrice -
										order.payment.refund.reduce((a, c) => a + c.amount, 0) / 100).toFixed(2)}
								</div>
							</div>
						)}
					</div>
					{admin && (
						<div className="fs-16px">
							<h3>Since Order</h3>
							{daysBetween(today, order.createdAt) > 1 ? (
								`${daysBetween(today, order.createdAt)} Days`
							) : (
								`${daysBetween(today, order.createdAt)} Day`
							)}
						</div>
					)}
					<div className="fs-16px">
						<h3>Ship To</h3>
						<Link to={`/secure/glow/userprofile/${order.user && order.user._id}`}>
							{order.shipping.first_name} {order.shipping.last_name}
						</Link>
					</div>
					{order.shipping.shipping_rate && (
						<div className="fs-16px">
							<p className="title_font ai-c fs-30px">
								{order.shipping.shipping_rate.service !== 'First' &&
									order.shipping.shipping_rate.service}{' '}
							</p>
						</div>
					)}
				</div>
				<div className="w-40per jc-fe">
					<div className="">
						<div className="fs-16px">
							<div className="row ai-c">
								<h3 className="mr-10px">Order Number: </h3>
								<div>{order._id}</div>
							</div>
							{order.tracking_number && (
								<div className="row ai-c mb-2rem">
									<h3 className="mr-10px  mv-0px">Tracking Number: </h3>
									<div className="mt-0px">
										{' '}
										<a
											href={determine_tracking_number(order.tracking_number)}
											target="_blank"
											rel="noopener noreferrer"
											className="mv-2rem"
											style={{
												textDecoration: 'underline',
												color: 'white'
											}}
										>
											{order.tracking_number}
										</a>
									</div>
								</div>
							)}
						</div>
						<div className="row fs-16px jc-b ai-c">
							<Link
								to={{
									pathname: '/secure/account/order/' + order._id,
									previous_path: history.location.pathname + history.location.search
								}}
							>
								<button className="btn primary">Order Details</button>
							</Link>
							<div>|</div>
							<button className="btn secondary">
								{/* <Link to={'/secure/glow/emails/invoice/' + order._id}>View Invoice</Link> */}
								<Link
									to={{
										pathname: '/secure/glow/emails/invoice/' + order._id,
										previous_path: history.location.pathname + history.location.search
									}}
								>
									View Invoice
								</Link>
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="small_screen_order jc-b ">
					<div className="wrap">
						{order.orderItems.map((item, index) => {
							return (
								<div className="row mt-15px" key={index}>
									<div className="column ai-c pos-rel">
										<Link to={determnine_link(item)}>
											<div className="">
												{!item.secondary_image && (
													<LazyImage
														className="order-image br-10px mr-15px w-70px h-70px"
														alt={item.name}
														title="Product Image"
														effect="blur"
														src={item.display_image && item.display_image}
													/>
												)}
												{item.secondary_image && (
													<div
														className={` double-image-cart${item.name &&
														item.name.split('-')[1] === '2 Tone'
															? '-vertical'
															: ' row'}`}
													>
														<LazyImage
															id="expandedImg"
															alt={item.name}
															title={item.name}
															className={`details-image-cart-${item.name &&
															item.name.split('-')[1] === '2 Tone'
																? 'top'
																: 'left'} m-0px`}
															src={item.display_image}
														/>
														<LazyImage
															id="expandedSecondaryImg"
															alt={item.name}
															title={item.name}
															className={`details-image-cart-${item.name &&
															item.name.split('-')[1] === '2 Tone'
																? 'bottom'
																: 'right'} mr-15px`}
															src={item.secondary_image}
														/>
													</div>
												)}
											</div>
										</Link>
										{item.qty > 1 && (
											<div
												className="pos-abs br-10px w-2rem h-2rem  ai-c ta-c jc-c bottom-0px right-5px"
												style={{
													backgroundColor: 'white',
													color: 'black',
													border: '1px solid #ccc'
												}}
											>
												<div className="mt-3px ml-2px">{item.qty}</div>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="small_screen_order jc-b">
					<div className="mv-auto">
						{order.orderItems.map((item, index) => {
							return <div key={index}>{determine_product_name(item, true, order.createdAt)}</div>;
						})}
					</div>
				</div>
				<Link to={'/collections/all/products/' + order.orderItems[0].category} className="ai-c ml-1rem">
					<button className="btn primary">Buy Again</button>
				</Link>

				{admin && (
					<div className="jc-fe column ml-auto ">
						<button className="btn icon h-3rem " onClick={() => show_hide(order._id)}>
							<i style={{ WebkitTransform: 'rotate(-180deg)' }} className="top-8px fas fa-sort-up" />
						</button>
					</div>
				)}
			</div>

			{admin && (
				<div id={order._id} className="expanded-row-content hide-row">
					<div className="jc-b pt-10px mt-10px" style={{ borderTop: '1px solid white' }}>
						<div className=" ">
							<h2>Shipping</h2>
							<div className="paragraph_font lh-25px">
								<div>
									{order.shipping.first_name} {order.shipping.last_name}
								</div>
								<div>
									{order.shipping.address_1} {order.shipping.address_2}
								</div>
								<div>
									{order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
								</div>
								<div>{order.shipping.country}</div>
								<div>{order.shipping.international && 'International'}</div>
								<div>{order.shipping.email}</div>
							</div>
						</div>
						<div className="column jc-b h-10rem w-20rem ml-1rem">
							<h2>Order Status</h2>
							<div>
								<div className="row ai-c">
									<div className="mv-5px">
										{order.isPaid ? (
											<i className="fas fa-check-circle" />
										) : (
											<i className="fas fa-times-circle" />
										)}
									</div>
									<div className="mh-10px">Paid</div>
									<div>{!order.paidAt ? '' : format_date(order.paidAt)}</div>
								</div>
							</div>
							<div>
								<div className="row ai-c">
									<div className="mv-5px">
										{order.isManufactured ? (
											<i className="fas fa-check-circle" />
										) : (
											<i className="fas fa-times-circle" />
										)}
									</div>
									<div className="mh-10px">Manufactured</div>

									<div>{!order.manufacturedAt ? '' : format_date(order.manufacturedAt)}</div>
								</div>
							</div>
							<div>
								<div className="row ai-c">
									<div className="mv-5px">
										{order.isPackaged ? (
											<i className="fas fa-check-circle" />
										) : (
											<i className="fas fa-times-circle" />
										)}
									</div>
									<div className="mh-10px">Packaged</div>

									<div>{!order.packagedAt ? '' : format_date(order.packagedAt)}</div>
								</div>
							</div>
							<div>
								<div className="row ai-c">
									<div className="mv-5px">
										{order.isShipped ? (
											<i className="fas fa-check-circle" />
										) : (
											<i className="fas fa-times-circle" />
										)}
									</div>
									<div className="mh-10px">Shipped</div>

									<div>{!order.shippedAt ? '' : format_date(order.shippedAt)}</div>
								</div>
							</div>
							<div>
								<div className="row ai-c">
									<div className="mv-5px row">
										{order.isDelivered ? (
											<i className="fas fa-check-circle" />
										) : (
											<i className="fas fa-times-circle" />
										)}
									</div>
									<div className="mh-10px">Delivered</div>

									<div>{!order.deliveredAt ? '' : format_date(order.deliveredAt)}</div>
								</div>
							</div>
						</div>
						<ul className="m-0px">
							<h2>Meta Data</h2>
							<li className="row mv-2rem">
								<label className="phrase_font">Payment Method </label>
								<label className="ml-1rem">{order.payment.paymentMethod}</label>
							</li>
							<li className="row mv-2rem">
								<label className="phrase_font">Order Note: </label>
								<label className="ml-1rem">{order.order_note}</label>
							</li>
							<li className="row mv-2rem">
								<label className="phrase_font">Promo Code: </label>
								<label className="ml-1rem">{order.promo_code}</label>
							</li>
							<li className="row">
								<label className="phrase_font">Tracking Number: </label>

								<a
									href={determine_tracking_number(order.tracking_number)}
									target="_blank"
									rel="noopener noreferrer"
									className="mv-2rem ml-1rem"
									style={{
										textDecoration: 'underline',
										color: 'white'
									}}
								>
									{order.tracking_number}
								</a>
							</li>
							{order.return_tracking_number && (
								<li className="row">
									<label className="phrase_font">Return Tracking Number: </label>

									<a
										href={determine_tracking_number(order.return_tracking_number)}
										target="_blank"
										rel="noopener noreferrer"
										className="mv-2rem ml-1rem"
										style={{
											textDecoration: 'underline',
											color: 'white'
										}}
									>
										{order.return_tracking_number}
									</a>
								</li>
							)}

							{order.guest && (
								<li className="row">
									<label className="phrase_font">
										Guest Order: {order.guest ? 'True' : 'False'}{' '}
									</label>
								</li>
							)}
						</ul>

						<div className="jc-b">
							<div className="column w-25rem">
								{/* {order.shipping.shipping_label && (
									<button className="btn secondary mv-5px" onClick={() => view_label()}>
										View Label
									</button>
								)}
								{order.shipping.return_shipping_label && (
									<button className="btn secondary mv-5px" onClick={() => view_return_label()}>
										View Return Label
									</button>
								)} */}
								<button className="btn secondary w-100per mv-10px" onClick={() => sendEmail('Hello')}>
									Send User a Message
								</button>
								<button
									className="btn secondary mv-5px"
									onClick={() => create_duplicate_order(order._id)}
								>
									Create Duplicate Order
								</button>
								<button className="btn secondary mv-5px">
									<Link to={'/secure/glow/editorder/' + order._id}>Edit Order</Link>
								</button>

								<button className="btn secondary mv-5px" onClick={() => delete_order()}>
									Delete Order
								</button>
								{hide_label_button &&
								!order.shipping.shipping_label && (
									<button className="btn primary mv-5px" onClick={() => buy_label()}>
										Buy Label
									</button>
								)}
								{order.shipping.shipping_label && (
									<button className="btn secondary mv-5px" onClick={() => view_label()}>
										Print Label
									</button>
								)}
								<button className="btn secondary w-100per mv-5px " onClick={get_invoice}>
									Print Invoice
								</button>
							</div>
						</div>
						<OrderStatusButtons
							order={order}
							update_order_payment_state={update_order_payment_state}
							update_order_state={update_order_state}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderListItem;
