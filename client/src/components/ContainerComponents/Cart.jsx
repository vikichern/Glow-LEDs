import React, { useRef, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userActions';
import { HashLink } from 'react-router-hash-link';
import { addToCart, removeFromCart } from '../../actions/cartActions';
import { cart_sale_price_switch, determine_product_name } from '../../utils/react_helper_functions';

const Cart = (props) => {
	const history = useHistory();

	function useOutsideAlerter(ref) {
		useEffect(
			() => {
				/** Alert if clicked on outside of element */
				function handleClickOutside(event) {
					if (ref.current && !ref.current.contains(event.target)) {
						// alert('You clicked outside of me!');
						document.querySelector('.cart_sidebar').classList.remove('open');
					}
				}
				// Bind the event listener
				document.addEventListener('mousedown', handleClickOutside);
				return () => {
					// Unbind the event listener on clean up
					document.removeEventListener('mousedown', handleClickOutside);
				};
			},
			[ ref ]
		);
	}
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef);

	const closeMenu = () => {
		document.querySelector('.cart_sidebar').classList.remove('open');
	};
	const dispatch = useDispatch();

	const [ first_name, set_first_name ] = useState('');
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(
		() => {
			if (userInfo) {
				set_first_name(userInfo.first_name);
			}

			// }
		},
		[ userInfo ]
	);

	const cart = useSelector((state) => state.cart);

	const { cartItems } = cart;
	// console.log({ cartItems });

	const [ no_items_in_cart, set_no_items_in_cart ] = useState('');

	const removeFromCartHandler = (product) => {
		dispatch(removeFromCart(product));
	};

	const checkoutHandler = () => {
		if (cartItems.length === 0) {
			set_no_items_in_cart('Cannot proceed to checkout without any items in cart');
		} else {
			if (userInfo.hasOwnProperty('first_name')) {
				history.push('/account/login?redirect=/secure/checkout/placeorder');
			} else {
				history.push('/checkout/decision');
			}
		}
		closeMenu();
	};

	const decide_warning = () => {
		if (new Date() > new Date('2020-12-17') && new Date() < new Date('2021-01-02')) {
			const confirm = window.confirm(
				'Glow LEDs will be out of office from 12/18/20 - 1/2/21. Orders will not be shipped until after January 2nd 2021'
			);
			if (confirm) {
				checkoutHandler();
			}
		} else {
			checkoutHandler();
		}
	};
	const no_adapters_warning = () => {
		const categories = cartItems.map((cartItem) => {
			return cartItem.category;
		});
		// const names = cartItems.map((cartItem) => {
		// 	return cartItem.name;
		// });
		if (
			!categories.includes('Custom Diffuser Caps Final Payment') ||
			!categories.includes('Custom Diffuser Caps Deposit')
		) {
			if (categories.includes('diffuser_caps')) {
				// console.log('Caps');
				if (!categories.includes('diffuser_adapters')) {
					return "Don't Forget: You'll need a set of Diffuser Adapters to use Diffuser Caps!";
				}
			}
		}
	};
	const navbarStyles = {
		// position: 'fixed',
		// height: '160px',
		// width: '100%',
		// backgroundColor: 'grey',
		// textAlign: 'center',
		transition: 'top 0.2s'
	};

	const determine_top = () => {
		if (props.width >= 1177) {
			return '179px';
		} else if (props.width < 1140 && props.width > 704) {
			return '130px';
		} else if (props.width < 704 && props.width > 528) {
			return '116px';
		} else if (props.width < 528) {
			return '110px';
		} else {
			return '110px';
		}
	};
	return (
		<aside
			ref={wrapperRef}
			className="cart_sidebar"
			style={{ ...navbarStyles, top: props.visible ? determine_top() : '0px', overflowY: 'scroll' }}
		>
			<div>
				{/* <div className="logo_text mh-auto ai-c">
					<Link to="/">
						<div className="h-50px w-50px">
							<img
								className="zoom logo_s"
								src="/images/optimized_images/logo_images/glow_logo_optimized.png"
								alt="Glow LEDs Logo"
								title="Small Logo"
							/>
						</div>
					</Link>
					<Link to="/">
						<div className="row">
							<label className="ml-5px fs-30px mv-0px ff-h">Shopping Cart</label>
						</div>
					</Link>
				</div> */}
				<button className="cart_sidebar_close_button" aria-label="close" onClick={closeMenu}>
					<i className="fas fa-times" />
				</button>
			</div>
			<ul className="cart_sidebar-list-container w-100per mr-1rem">
				<li>
					<h2>Shopping Cart</h2>
					<div>Price</div>
				</li>
				{cartItems.length === 0 ? (
					<div className="column ai-b">
						<div>Cart is empty</div>
					</div>
				) : (
					<div className="h-40vh" style={{ overflowY: 'scroll' }}>
						<h4>{no_adapters_warning()}</h4>
						{cartItems.map((item, index) => (
							<li key={index}>
								{console.log({ item })}
								<div className="cart_sidebar-image">
									<Link to={'/collections/all/products/' + item.pathname}>
										<img
											src={item.display_image}
											height="100px"
											width="100px"
											alt={item.name}
											title="Product Image"
										/>
									</Link>
								</div>
								<div className="cart_sidebar-name">
									<div className="mb-10px">
										<Link to={'/collections/all/products/' + item.pathname}>
											{determine_product_name(item)}
										</Link>
									</div>
									<div>
										<div className="ai-c h-25px">
											<label
												aria-label="sortOrder"
												htmlFor="sortOrder"
												className="select-label mr-1rem"
											>
												Qty:
											</label>
											{/* {console.log(
												item.product_option.images
													? item.product_option.images[0]
													: item.display_image
											)} */}
											{/* {console.log({ product_option_image: item.product_option.images[0] })}
											{console.log({ display_image: item.display_image })} */}
											<div className="custom-select">
												<select
													defaultValue={item.qty}
													className="qty_select_dropdown"
													onChange={(e) => {
														dispatch(
															addToCart(
																item.pathname,
																e.target.value,
																item.color && item.color,
																item.diffuser_cap && item.diffuser_cap,
																item.product_option && item.product_option,
																item.display_image
															)
														);
													}}
												>
													{[ ...Array(item.countInStock).keys() ].map((x) => (
														<option key={x + 1} defaultValue={parseInt(x + 1)}>
															{parseInt(x + 1)}
														</option>
													))}
												</select>
												<span className="custom-arrow" />
											</div>
										</div>
									</div>
								</div>

								<div className="">
									<div className="cart_sidebar-price">
										{cart_sale_price_switch(item)}
										{/* {item.product_option.sale_price > 0 ? (
											<label>
												<del style={{ color: 'red' }}>
													<label style={{ color: 'white' }}>
														${item.product_option.price ? (
															item.product_option.price.toFixed(2)
														) : item.price ? (
															item.price.toFixed(2)
														) : (
															item.price
														)}
													</label>
												</del>{' '}
												<i class="fas fa-arrow-right" /> ${item.product_option.sale_price ? (
													item.product_option.sale_price.toFixed(2)
												) : item.sale_price ? (
													item.sale_price.toFixed(2)
												) : (
													item.sale_price
												)}{' '}
												On Sale!
											</label>
										) : (
											<label>
												${item.product_option.price ? (
													item.product_option.price.toFixed(2)
												) : item.price ? (
													item.price.toFixed(2)
												) : (
													item.price
												)}
											</label>
										)} */}
									</div>
									<div style={{ textAlign: 'right', width: '100%' }}>
										<button className="btn icon" onClick={() => removeFromCartHandler(item)}>
											<i className="fas fa-trash-alt" />
										</button>
									</div>
								</div>
							</li>
						))}
					</div>
				)}
			</ul>
			<h3 className="subtotal_h3">
				Subtotal ( {cartItems.reduce((a, c) => parseInt(a) + parseInt(c.qty), 0)} items ) : ${' '}
				{cartItems.reduce((a, c) => a + c.sale_price * c.qty, 0) === 0 ? (
					cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)
				) : (
					cartItems.reduce((a, c) => a + c.sale_price * c.qty, 0).toFixed(2)
				)}
			</h3>

			<button className="btn secondary w-100per mb-1rem" onClick={closeMenu}>
				<Link to="/checkout/cart">View Cart</Link>
			</button>

			<button onClick={decide_warning} className="btn primary w-100per">
				Proceed to Checkout
			</button>
			<h4 style={{ textAlign: 'center' }}>{no_items_in_cart}</h4>
		</aside>
	);
};

export default Cart;
