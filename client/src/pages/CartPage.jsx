import React, { useEffect } from 'react';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Title, ButtonSymbol } from '../components/UtilityComponents';
import { FlexContainer, BlockContainer } from '../components/ContainerComponents';
const CartPage = (props) => {
	const cart = useSelector((state) => state.cart);

	const { cartItems } = cart;

	console.log(cartItems);
	const productId = props.match.params.id;
	const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
	const dispatch = useDispatch();

	const removeFromCartHandler = (productId) => {
		dispatch(removeFromCart(productId));
	};

	useEffect(() => {
		if (productId) {
			dispatch(addToCart(productId, qty));
		}
	}, []);

	const checkoutHandler = () => {
		props.history.push('/login?redirect=shipping');
	};

	return (
		<div className="cart">
			<div className="cart-list">
				<ul className="cart-list-container">
					<li>
						<h2>Shopping Cart</h2>
						<div>Price</div>
					</li>
					{cartItems.length === 0 ? (
						<div>Cart is empty</div>
					) : (
						cartItems.map((item, index) => (
							<li key={index}>
								{console.log({ item })}
								<div className="cart-image">
									<img src={item.display_image} alt="product" />
								</div>
								<div className="cart-name">
									<div>
										<Link to={'/product/' + item.product}>{item.name}</Link>
									</div>
									<div>
										<FlexContainer v_i_center styles={{ height: '25px' }}>
											Qty:{' '}
											<div className="qty_select_dropdown_container">
												<select
													defaultValue={item.qty}
													className="qty_select_dropdown"
													onChange={(e) => dispatch(addToCart(item.product, e.target.value))}
												>
													{[ ...Array(item.countInStock).keys() ].map((x) => (
														<option key={x + 1} defaultValue={x + 1}>
															{x + 1}
														</option>
													))}
												</select>
												<i className="fas fa-sort-up icon_styles" />
											</div>
										</FlexContainer>
									</div>
								</div>

								<FlexContainer column>
									<div className="cart-price">${item.price.toFixed(2)}</div>
									<div style={{ textAlign: 'right', width: '100%' }}>
										<ButtonSymbol arg={item.product} on_click_function={removeFromCartHandler}>
											<i className="fas fa-trash-alt" />
										</ButtonSymbol>
									</div>
								</FlexContainer>
							</li>
						))
					)}
				</ul>
			</div>
			<FlexContainer h_center class="cart-action-container">
				<div className="cart-action">
					<h3 className="subtotal_h3">
						Subtotal ( {cartItems.reduce((a, c) => a + c.qty, 0)} items ) : ${' '}
						{cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}
					</h3>
					<button
						onClick={checkoutHandler}
						className="button primary full-width"
						disabled={cartItems.length === 0}
					>
						Proceed to Checkout
					</button>
				</div>
			</FlexContainer>
		</div>
	);
};

export default CartPage;
