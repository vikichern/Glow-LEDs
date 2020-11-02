import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveCart, detailsCart, listCarts } from '../../actions/cartActions';
import { FlexContainer } from '../../components/ContainerComponents';
import { Link, useHistory } from 'react-router-dom';
import { Loading } from '../../components/UtilityComponents';
import { Rating } from '../../components/SpecialtyComponents';
import { format_date, unformat_date } from '../../utils/helper_functions';
import { Helmet } from 'react-helmet';

const EditCartPage = (props) => {
	// const [modalVisible, setModalVisible] = useState(false);

	const [ id, set_id ] = useState('');
	const [ user, set_user ] = useState('');
	const [ glover_name, set_glover_name ] = useState('');
	const [ instagram_handle, set_instagram_handle ] = useState('');
	const [ facebook_name, set_facebook_name ] = useState('');
	const [ product, set_product ] = useState('');
	const [ song_id, set_song_id ] = useState('');
	const [ video, set_video ] = useState('');
	const [ picture, set_picture ] = useState('');
	const [ release_date, set_release_date ] = useState('');
	const [ loading_data, set_loading_data ] = useState(true);

	const history = useHistory();

	const cartDetails = useSelector((state) => state.cartDetails);
	const { cart, loading, error } = cartDetails;

	const cartSave = useSelector((state) => state.cartSave);
	const { loading: loadingSave, success: successSave, error: errorSave } = cartSave;

	const cartDelete = useSelector((state) => state.cartDelete);
	const { loading: loadingDelete, success: successDelete, error: errorDelete } = cartDelete;

	// const cartReviewDelete = useSelector((state) => state.cartReviewDelete);
	// const { success: cartDeleteSuccess } = cartReviewDelete;
	const cartList = useSelector((state) => state.cartList);
	const { carts } = cartList;

	const dispatch = useDispatch();
	const cart_id = props.match.params.id ? props.match.params.id : '';

	console.log({ cart });

	useEffect(() => {
		if (props.match.params.id) {
			console.log('Is ID');
			dispatch(detailsCart(props.match.params.id));
			dispatch(detailsCart(props.match.params.id));
		}
		// else {
		// 	dispatch(detailsCart(''));
		// }

		// set_loading_data(false);
		set_state();
		return () => {};
	}, []);

	useEffect(
		() => {
			if (cart) {
				console.log('Set');
				set_state();
			} else {
				console.log('UnSet');
				unset_state();
			}

			return () => {};
		},
		[ cart ]
	);

	const set_state = () => {
		set_id(cart._id);
		set_user(cart.user);
		set_glover_name(cart.glover_name);
		set_instagram_handle(cart.instagram_handle);
		set_facebook_name(cart.facebook_name);
		set_product(cart.product);
		set_song_id(cart.song_id);
		set_video(cart.video);
		set_picture(cart.picture);
		if (cart.release_date) {
			set_release_date(format_date(cart.release_date));
		}

		// fcart.release_date);
		// console.log(format_date(cart.release_date));
	};
	const unset_state = () => {
		set_id('');
		set_user('');
		set_glover_name('');
		set_instagram_handle('');
		set_facebook_name('');
		set_product('');
		set_song_id('');
		set_video('');
		set_picture('');
		set_release_date('');
	};

	const submitHandler = (e) => {
		e.preventDefault();
		console.log(release_date);
		console.log(format_date(release_date));
		console.log(unformat_date(format_date(release_date)));
		// console.log(unformat_date(release_date));
		// console.log(format_date(unformat_date(release_date)));
		// console.log(format_date(unformat_date(release_date)));

		console.log({ id });
		dispatch(
			saveCart({
				_id: id,
				user,
				glover_name,
				instagram_handle,
				facebook_name,
				product,
				song_id,
				video,
				picture,
				release_date: unformat_date(release_date)
			})
		);
		e.target.reset();
		set_id('');
		set_user('');
		set_glover_name('');
		set_instagram_handle('');
		set_facebook_name('');
		set_product('');
		set_song_id('');
		set_video('');
		set_picture('');
		set_release_date('');
		// if (id) {
		// 	history.push('/collections/all/carts/' + id);
		// } else {
		history.push('/secure/glow/carts');
		// }
	};

	return (
		<div class="main_container">
			<h1 style={{ textAlign: 'center' }}>{props.match.params.id ? 'Edit Cart' : 'Create Cart'}</h1>

			<div className="form">
				<form onSubmit={submitHandler} style={{ width: '100%' }}>
					{/* {loading_data ? (
						<div>Loading...</div>
					) : ( */}
					<Loading loading={loading} error={error}>
						{cart && (
							<div>
								<Helmet>
									<title>Edit Cart | Glow LEDs</title>
								</Helmet>

								<ul className="edit-form-container" style={{ maxWidth: '30rem', marginBottom: '20px' }}>
									<h1
										style={{
											textAlign: 'center',
											width: '100%',
											marginRight: 'auto',
											justifyContent: 'center'
										}}
									/>

									<FlexContainer row wrap>
										<FlexContainer column styles={{ width: '228px', margin: '10px' }}>
											<li>
												<label htmlFor="user">User</label>
												<input
													type="text"
													name="user"
													value={user}
													id="user"
													onChange={(e) => set_user(e.target.value)}
												/>
											</li>
											{console.log({ release_date })}

											<li>
												<label htmlFor="release_date">Release Date</label>
												<input
													type="text"
													name="release_date"
													value={release_date}
													id="release_date"
													onChange={(e) => set_release_date(e.target.value)}
												/>
											</li>
											<li>
												<label htmlFor="glover_name">Glover Name</label>
												<input
													type="text"
													name="glover_name"
													value={glover_name}
													id="glover_name"
													onChange={(e) => set_glover_name(e.target.value)}
												/>
											</li>
											<li>
												<label htmlFor="instagram_handle">Instagram Handle</label>
												<input
													type="text"
													name="instagram_handle"
													value={instagram_handle}
													id="instagram_handle"
													onChange={(e) => set_instagram_handle(e.target.value)}
												/>
											</li>
											<li>
												<label htmlFor="facebook_name">Facebook Name</label>
												<input
													type="text"
													name="facebook_name"
													value={facebook_name}
													id="facebook_name"
													onChange={(e) => set_facebook_name(e.target.value)}
												/>
											</li>
											<li>
												<label htmlFor="product">Product</label>
												<input
													type="text"
													name="product"
													value={product}
													id="product"
													onChange={(e) => set_product(e.target.value)}
												/>
											</li>

											<li>
												<label htmlFor="video">Video</label>
												<input
													type="text"
													name="video"
													value={video}
													id="video"
													onChange={(e) => set_video(e.target.value)}
												/>
											</li>
											<li>
												<label htmlFor="song_id">Song ID</label>
												<input
													type="text"
													name="song_id"
													value={song_id}
													id="song_id"
													onChange={(e) => set_song_id(e.target.value)}
												/>
											</li>
											<li>
												<label htmlFor="picture">Picture</label>
												<input
													type="text"
													name="picture"
													value={picture}
													id="picture"
													onChange={(e) => set_picture(e.target.value)}
												/>
											</li>
										</FlexContainer>
									</FlexContainer>
									<li>
										<button type="submit" className="button primary">
											{id ? 'Update' : 'Create'}
										</button>
									</li>
									<li>
										{id ? (
											<Link to="/secure/glow/carts">
												<button
													style={{ width: '100%' }}
													type="button"
													className="button secondary"
												>
													Back to Cart
												</button>
											</Link>
										) : (
											<Link to="/secure/glow/carts">
												<button
													style={{ width: '100%' }}
													type="button"
													className="button secondary"
												>
													Back to Carts
												</button>
											</Link>
										)}
									</li>
								</ul>
							</div>
						)}
					</Loading>
					{/* )} */}
				</form>
			</div>
		</div>
	);
};
export default EditCartPage;
