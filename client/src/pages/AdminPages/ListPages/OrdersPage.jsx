import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, update_order, update_payment } from '../../../actions/orderActions';
import { Loading, Notification } from '../../../components/UtilityComponents';
import { Helmet } from 'react-helmet';
import { OrderListItem, OrderSmallScreen, Search, Sort, Pagination } from '../../../components/SpecialtyComponents';
import { API_Emails, API_Orders } from '../../../utils';
import { getUrlParameter, toCapitalize } from '../../../utils/helper_functions';
import { check_authentication } from '../../../utils/react_helper_functions';
import { orders_upload } from '../../../utils/google_sheets_upload';

const OrdersPage = (props) => {
	const [ search, set_search ] = useState('');
	const [ sort, setSortOrder ] = useState('');
	const [ payment_method, set_payment_method ] = useState('');
	const [ page, set_page ] = useState(1);
	const [ limit, set_limit ] = useState(10);
	const [ loading_email, set_loading_email ] = useState('');

	const category = props.match.params.category ? props.match.params.category : '';
	const orderList = useSelector((state) => state.orderList);
	const { loading, orders, totalPages, message, currentPage, error } = orderList;

	const dispatch = useDispatch();

	const [ order_state, set_order_state ] = useState({});

	const query = getUrlParameter(props.location);

	useEffect(
		() => {
			let clean = true;
			if (clean) {
				if (query.page) {
					console.log({ page: query.page });
					set_page(query.page);
					set_limit(query.limit);
					dispatch(listOrders({ category, search, sort, page: query.page, limit: query.limit }));
				}
			}
			return () => (clean = false);
		},
		[ query.page ]
	);

	useEffect(
		() => {
			let clean = true;
			if (clean) {
				if (currentPage) {
					set_page(currentPage);
				}
			}
			return () => (clean = false);
		},
		[ currentPage ]
	);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(listOrders({ category, search, sort, page, limit }));
	};

	const sortHandler = (e) => {
		setSortOrder(e.target.value);
		dispatch(listOrders({ category, search, sort: e.target.value, page, limit }));
	};

	const colors = [
		{ name: 'Not Paid', color: '#6d3e3e' },
		{ name: 'Paid', color: '#3e4c6d' },
		{ name: 'Manufactured', color: '#4b7188' },
		{ name: 'Packaged', color: '#6f5f7d' },
		{ name: 'Shipped', color: '#636363' },
		{ name: 'Delivered', color: '#333333' },
		{ name: 'Priority', color: '#874d72' },
		{ name: 'Label Created', color: '#31887c' }
		// { name: 'Refunded', color: '#a9a9a9' }
	];

	const determine_color = (order) => {
		let result = '';
		if (!order.isPaid) {
			result = colors[0].color;
		}
		if (order.isPaid) {
			result = colors[1].color;
		}
		if (order.shipping.shipping_rate && order.shipping.shipping_rate.service !== 'First') {
			result = colors[6].color;
		}
		if (order.isManufactured) {
			result = colors[2].color;
		}
		if (order.shipping.shipping_label) {
			result = colors[7].color;
		}
		if (order.isPackaged) {
			result = colors[3].color;
		}
		if (order.isShipped) {
			result = colors[4].color;
		}
		if (order.isDelivered) {
			result = colors[5].color;
		}
		// if (order.isRefunded) {
		// 	result = colors[6].color;
		// }
		return result;
	};

	const sort_options = [
		'Date',
		'Paid',
		'Manufactured',
		'Packaged',
		'Shipped',
		'Delivered',
		'Newest',
		'Lowest',
		'Highest'
	];

	// const update_order_state = (order, state, is_action, action_at) => {
	// 	if (state) {
	// 		set_order_state({ ...order_state, [is_action]: false });
	// 		dispatch(update_order(order, false, is_action, action_at));
	// 	} else {
	// 		set_order_state({ ...order_state, [is_action]: true });
	// 		dispatch(update_order(order, true, is_action, action_at));
	// 		history.push(`/secure/glow/emails/order_status/${order._id}/${is_action.substring(2)}/true`);
	// 	}
	// };

	const update_order_state = (order, state, is_action, action_at) => {
		set_loading_email(true);
		if (state) {
			set_order_state({ ...order_state, [is_action]: false });
			dispatch(update_order(order, false, is_action, action_at));
		} else {
			set_order_state({ ...order_state, [is_action]: true });
			dispatch(update_order(order, true, is_action, action_at));
			send_email(order, action_at.slice(0, -2));
		}
		setTimeout(() => {
			dispatch(listOrders({ category, search, sort, page, limit }));
		}, 200);
		set_loading_email(false);
	};

	// const update_order_payment_state = (order, state, is_action) => {
	// 	if (state) {
	// 		set_order_state({ ...order_state, [is_action]: false });
	// 		dispatch(update_payment(order, false, payment_method));
	// 	} else {
	// 		set_order_state({ ...order_state, [is_action]: true });
	// 		dispatch(update_payment(order, true, payment_method));
	// 		history.push(`/secure/glow/emails/order/${order._id}/order/false`);
	// 	}
	// };

	const send_paid_email = async (order_id) => {
		const { data: order } = await API_Orders.findById_orders_a(order_id);
		await API_Emails.send_order_email(order, 'Thank you for your Glow LEDs Order!', order.shipping.email);
		await API_Emails.send_order_email(
			order,
			'New Order Created by ' + order.shipping.first_name,
			'info.glowleds@gmail.com'
		);
	};
	const update_order_payment_state = (order, state, is_action) => {
		if (state) {
			set_order_state({ ...order_state, [is_action]: false });
			dispatch(update_payment(order, false, payment_method));
		} else {
			set_order_state({ ...order_state, [is_action]: true });
			dispatch(update_payment(order, true, payment_method));
			send_paid_email(order._id);
		}
		setTimeout(() => {
			dispatch(listOrders({ category, search, sort, page, limit }));
		}, 1000);
	};

	useEffect(
		() => {
			let clean = true;
			if (clean) {
				if (error) {
					check_authentication();
					dispatch(listOrders({ category, search, sort, page, limit }));
				}
			}
			return () => (clean = false);
		},
		[ error ]
	);

	const history = useHistory();

	const update_page = (e, new_page) => {
		console.log({ e, new_page });
		e.preventDefault();
		const page = parseInt(new_page);
		history.push({
			search: '?page=' + page + '?limit=' + limit
		});

		console.log(new_page);
		dispatch(listOrders({ category, search, sort, page: new_page, limit }));
	};

	useEffect(
		() => {
			let clean = true;
			if (clean) {
				is_shipped();
			}
			return () => (clean = false);
		},
		[ orders ]
	);

	const [ not_shipped, set_not_shipped ] = useState([]);

	const is_shipped = async () => {
		const { data: orders } = await API_Orders.mark_as_shipped();
		console.log({ orders });
		set_not_shipped(orders);
	};

	// const update_order_state = (order, state, is_action, action_at) => {
	// 	set_loading_email(true);
	// 	if (state) {
	// 		set_order_state({ ...order_state, [is_action]: false });
	// 		dispatch(update_order(order, false, is_action, action_at));
	// 	} else {
	// 		set_order_state({ ...order_state, [is_action]: true });
	// 		dispatch(update_order(order, true, is_action, action_at));
	// 		send_email(order, action_at.slice(0, -2));
	// 	}
	// 	setTimeout(() => {
	// 		dispatch(detailsOrder(props.match.params.id));
	// 	}, 200);
	// 	set_loading_email(false);
	// };

	const mark_as_shipped = async () => {
		const { data: orders } = await API_Orders.mark_as_shipped();
		orders.forEach(async (order) => {
			await dispatch(update_order(order, true, 'isShipped', 'shippedAt'));
			await send_email(order, 'shipped');
		});
		setTimeout(() => {
			dispatch(listOrders({ category, search, sort, page, limit }));
		}, 200);
	};

	const send_email = async (order, status, message_to_user) => {
		set_loading_email(true);
		console.log(
			order,
			status === "manufactured" ? 'Your Order has been Crafted!' : 'Your Order has been ' + toCapitalize(status) + "!",
			order.shipping.email,
			status,
			message_to_user
		);
		await API_Emails.send_order_status_email(
			order,
			status === "manufactured" ? 'Your Order has been Crafted!' : 'Your Order has been ' + toCapitalize(status) + "!",
			order.shipping.email,
			status,
			message_to_user
		);
		await API_Emails.send_order_status_email(
			order,
	status === "manufactured" ? order.shipping.first_name + "'s Order has been Crafted!" : 		order.shipping.first_name + "'s Order has been " + toCapitalize(status) + "!",
			'info.glowleds@gmail.com',
			status,
			message_to_user
		);
		set_loading_email(false);
	};

	const upload_orders = async () => {
		set_loading_email(true);
		const {data} = await API_Orders.findAll_orders_a()
		 console.log({data})
		await orders_upload(data.orders)
		set_loading_email(false);
	}

	return (
		<div className="profile_container wrap column p-20px">
			<Helmet>
				<title>Admin Orders | Glow LEDs</title>
			</Helmet>
			<Notification message={message} />
			<div className="wrap jc-b">
				<Link to="/secure/glow/controlpanel">
					<button className="btn primary">Back to Control Panel</button>
				</Link>
				<Link to="/secure/glow/create_label">
					<button className="btn primary">Create Label</button>
				</Link>
				<Link to="/secure/glow/combine_orders">
					<button className="btn primary">Combine Orders</button>
				</Link>
					<button className="btn primary" onClick={upload_orders}>Upload Orders</button>
				{not_shipped &&
				not_shipped.length > 0 && (
					<button className="btn primary" onClick={() => mark_as_shipped()}>
						Mark as Shipped
					</button>
				)}
			</div>
			<Loading loading={loading_email} />
			<div className="profile-orders profile_orders_container" style={{ width: '100%' }}>
				<div className="search_and_sort jc-b ai-c mt-2rem" style={{ overflowX: 'scroll' }}>
					<div className="w-40rem">
						{orders &&
							colors.map((color, index) => {
								return (
									<div className="wrap jc-b m-1rem " key={index}>
										<label className="w-10rem mr-1rem">{color.name}</label>

										{color.name === 'Not Paid' && orders.filter((order) => !order.isPaid).length}
										{color.name === 'Paid' &&
											orders.filter(
												(order) =>
													order.isPaid &&
													!order.isManufactured &&
													!order.isPackaged &&
													!order.isShipped
											).length}
										{color.name === 'Manufactured' &&
											orders.filter(
												(order) =>
													order.isManufactured &&
													!order.isPackaged &&
													!order.isShipped &&
													!order.isDelievered
											).length}
										{color.name === 'Packaged' &&
											orders.filter(
												(order) =>
													order.isManufactured &&
													order.isPackaged &&
													!order.isShipped &&
													!order.isDelievered
											).length}
										{color.name === 'Shipped' &&
											orders.filter(
												(order) =>
													order.isManufactured &&
													order.isPackaged &&
													order.isShipped &&
													!order.isDelievered
											).length}

										{color.name === 'Delivered' &&
											orders.filter(
												(order) =>
													order.isManufactured &&
													order.isPackaged &&
													order.isShipped &&
													order.isDelievered
											).length}
										{color.name === 'Priority' &&
											orders.filter(
												(order) =>
													order.shipping.shipping_rate &&
													order.shipping.shipping_rate.service !== 'First'
											).length}
										{color.name === 'Label Created' &&
											orders.filter((order) => order.shipping.shipping_label).length}
										<div
											style={{
												backgroundColor: color.color,
												height: '20px',
												width: '60px',
												borderRadius: '5px'
											}}
										/>
									</div>
								);
							})}
					</div>
				</div>
				<h1 className="ta-c, w-100per jc-c">Orders</h1>
				<div className="jc-b">
					<Search
						search={search}
						set_search={set_search}
						submitHandler={submitHandler}
						category={category}
						// className="max-w-50rem"
					/>
					<Sort sortHandler={sortHandler} sort_options={sort_options} />
				</div>
				<div className="jc-c">
					{totalPages && (
						<Pagination
							className="pagination-bar"
							currentPage={page}
							totalCount={totalPages}
							pageSize={limit}
							onPageChange={(e, page) => update_page(e, page)}
						/>
					)}
				</div>
				<Loading loading={loading} error={error}>
					<div className="product_big_screen">
						{orders &&
							orders.map((order, index) => (
								<OrderListItem
									key={index}
									determine_color={determine_color}
									update_order_payment_state={update_order_payment_state}
									update_order_state={update_order_state}
									set_payment_method={set_payment_method}
									admin={true}
									order={order}
								/>
							))}
					</div>
					<div className="product_small_screen none column">
						{orders &&
							orders.map((order, index) => (
								<OrderSmallScreen
									determine_color={determine_color}
									key={index}
									order={order}
									admin={true}
								/>
							))}
					</div>
				</Loading>
				<div className="jc-c">
					{totalPages && (
						<Pagination
							className="pagination-bar"
							currentPage={page}
							totalCount={totalPages}
							pageSize={limit}
							onPageChange={(e, page) => update_page(e, page)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
export default OrdersPage;
