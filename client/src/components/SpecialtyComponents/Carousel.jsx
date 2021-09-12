// React
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../../actions/productActions';
import CarouselItem from './CarouselItem';
import { Loading } from '../UtilityComponents';
import useWindowDimensions from '../Hooks/windowDimensions';
import { API_Products } from '../../utils';
import { shuffle } from '../../utils/helper_functions';
import { ProductItemD } from '../DesktopComponents';
import { browser_check, mobile_check } from '../../utils/react_helper_functions';

const Carousel = (props) => {
	const dispatch = useDispatch();

	// const productList = useSelector((state) => state.productList);
	// const { products, loading, error } = productList;
	const { height, width } = useWindowDimensions();

	const [ products, set_products ] = useState([]);
	const [ loading, set_loading ] = useState(false);
	// const productList = useSelector((state) => state.productList);
	// const { products, loading, error } = productList;
	// console.log({ products });

	useEffect(
		() => {
			if (props.category) {
				// dispatch(listProducts(props.category));
				get_products(props.category);
			} else {
				get_products('all');
			}
		},
		[ props.category ]
	);

	const get_products = async (category) => {
		set_loading(true);
		const { data } = await API_Products.get_products_by_category(category);
		console.log({ get_products: data });

		set_products(typeof data === 'object' && data.filter((product) => product.pathname !== props.product_pathname));
		if (props.random) {
			set_products(
				typeof data === 'object' &&
					shuffle(data.filter((product) => product.pathname !== props.product_pathname))
			);
		}
		set_loading(false);
	};

	const [ product_number, set_product_number ] = useState(0);
	const [ number_of_items, set_number_of_items ] = useState(5);

	const move_left = () => {
		if (product_number !== 0) {
			set_product_number((product_number) => {
				return product_number - 1;
			});
		}
	};
	const move_right = () => {
		if (product_number !== products.filter((product) => product.hidden === false).length - 5) {
			set_product_number((product_number) => {
				return product_number + 1;
			});
		}
	};

	const handleWindowResize = () => {
		if (width > 1530) {
			set_number_of_items(5);
		} else if (width > 1137 && width < 1529) {
			set_number_of_items(4);
		} else if (width > 911 && width < 1136) {
			set_number_of_items(3);
		} else if (width > 646 && width < 910) {
			set_number_of_items(2);
		} else if (width < 645) {
			set_number_of_items(1);
		}
	};

	useEffect(
		() => {
			handleWindowResize();
			return () => {};
		},
		[ width ]
	);

	return (
		<div className="mh-10px">
			{products.length > 0 && (
				<div>
					<h2 className="jc-c w-100per ta-c">{props.title}</h2>

					<Loading loading={loading}>
						{products &&
							(browser_check() !== 'safari' ? (
								<div className="row p-10px" style={{ overflowX: 'scroll' }}>
									<div className="row jc-b w-100per">
										<div className="ai-c">
											<button
												style={{ borderRadius: '50%' }}
												className="btn icon h-59px"
												onClick={() => move_left()}
											>
												<i className="fas fa-arrow-circle-left fs-40px" />
											</button>
										</div>
										{[ ...Array(number_of_items).keys() ].map((x) => (
											<div className="w-259px">
												<CarouselItem
													key={product_number + x}
													size="175px"
													add_to_cart={props.add_to_cart}
													product={
														products &&
														products
															.filter((product) => !product.option)
															.filter((product) => product.hidden === false)[
															product_number + x
														]
													}
													styles={{ listStyleType: 'none' }}
												/>
											</div>
										))}
										<div className="ai-c">
											<button
												style={{ borderRadius: '50%' }}
												className="btn icon h-59px"
												onClick={() => move_right()}
											>
												<i className="fas fa-arrow-circle-right fs-40px" />
											</button>
										</div>
									</div>
								</div>
							) : (
								<div className="row p-10px overflow-s">
									{products.map((item, index) => (
										<ProductItemD
											key={index}
											size="175px"
											product={item}
											styles={{ marginRight: 20, listStyleType: 'none' }}
										/>
									))}
								</div>
							))}
					</Loading>
				</div>
			)}
		</div>
	);
};

export default Carousel;
