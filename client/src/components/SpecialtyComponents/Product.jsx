// React
import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
// Components

const Product = (props) => {
	const sale_price_switch = () => {
		if (props.product.sale_price !== 0) {
			return (
				<label>
					<del style={{ color: 'red' }}>
						<label style={{ color: 'white' }}>
							${props.product.price ? props.product.price.toFixed(2) : props.product.price}
						</label>
					</del>{' '}
					<i class="fas fa-arrow-right" /> ${props.product.sale_price ? (
						props.product.sale_price.toFixed(2)
					) : (
						props.product.sale_price
					)}{' '}
					On Sale!
				</label>
			);
		} else if (!props.product.countInStock) {
			return (
				<label>
					<del style={{ color: 'red' }}>
						<label style={{ color: 'white', marginRight: '7px' }}>
							${props.product.price ? props.product.price.toFixed(2) : props.product.price}
						</label>
					</del>{' '}
					<i class="fas fa-arrow-right" />
					<label style={{ marginLeft: '7px' }}>Sold Out</label>
				</label>
			);
		} else {
			return <label>${props.product.price ? props.product.price.toFixed(2) : props.product.price}</label>;
		}
	};

	// console.log(props.product);
	return (
		<li key={props.product._id} style={props.styles}>
			<div className="product">
				<Link to={'/product/' + props.product._id}>
					<img className="product-image" src={props.product.display_image} alt="product" />
				</Link>
				<label styles={{ fontSize: '1.3rem' }}>{props.product.brand}</label>
				<Link to={'/product/' + props.product._id}>
					<label styles={{ fontSize: '1.6rem' }}>{props.product.name}</label>
				</Link>
				<label className="product-price">{sale_price_switch()}</label>
				{props.product.rating ? (
					<Rating value={props.product.rating} text={props.product.numReviews + ' reviews'} />
				) : (
					<span className="rating" style={{ textAlign: 'center', visibility: 'hidden' }}>
						No Reviews
					</span>
				)}
			</div>
		</li>
	);
};

export default Product;
