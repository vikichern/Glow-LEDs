import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, deleteOrder } from '../actions/orderActions';
import { format_date_display } from '../utils/helper_functions';
import { FlexContainer } from '../components/ContainerComponents';
import { Loading } from '../components/UtilityComponents';
import { listUsers, deleteUser } from '../actions/userActions';
import { Search, Sort } from '../components/SpecialtyComponents';
import MetaTags from 'react-meta-tags';

const UsersPage = (props) => {
	const userList = useSelector((state) => state.userList);
	const { loading, users, error } = userList;

	const userDelete = useSelector((state) => state.userDelete);
	const { loading: loadingDelete, success: successDelete, error: errorDelete } = userDelete;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;
	// console.log({ users_page: userInfo });

	// const userToken = useSelector(state => state.userToken);
	// // const { to } = userToken;
	// console.log({ userToken })

	const dispatch = useDispatch();

	// useEffect(() => {
	//   // dispatch(token(userInfo.refreshToken));
	// }, [error]);

	useEffect(
		() => {
			dispatch(listUsers());
		},
		[ successDelete ]
	);

	const deleteHandler = (user) => {
		dispatch(deleteUser(user._id));
	};
	const [ searchKeyword, setSearchKeyword ] = useState('');
	const [ sortOrder, setSortOrder ] = useState('');

	const submitHandler = (e) => {
		e.preventDefault();
		// dispatch(listProducts(category, searchKeyword, sortOrder));
	};

	const sortHandler = (e) => {
		setSortOrder(e.target.value);
		// dispatch(listProducts(category, searchKeyword, e.target.value));
	};

	// useEffect(
	// 	() => {
	// 		dispatch(listProducts(category, searchKeyword, sortOrder));
	// 	},
	// 	[ sortOrder ]
	// );

	const colors = {
		not_verified: '#333333',
		verifid: '#8e8e8e',
		admin: '#626262'
	};

	return (
		<div class="main_container">
			<MetaTags>
				<title>Glow LEDs Admin Users</title>
				<meta property="og:title" content="Glow LEDs Admin Users" />
				<meta name="description" content="Glow LEDs Admin Users" />
				<meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* <meta property="og:image" content="path/to/image.jpg" /> */}
			</MetaTags>
			<FlexContainer h_between wrap>
				<FlexContainer h_between styles={{ margin: '1rem', width: '20rem' }}>
					<label style={{ marginRight: '1rem' }}>Not Verfied</label>
					<div style={{ backgroundColor: '#333333', height: '20px', width: '60px', borderRadius: '5px' }} />
				</FlexContainer>
				<FlexContainer h_between styles={{ margin: '1rem', width: '20rem' }}>
					<label style={{ marginRight: '1rem' }}>Verified</label>
					<div style={{ backgroundColor: '#8e8e8e', height: '20px', width: '60px', borderRadius: '5px' }} />
				</FlexContainer>
				<FlexContainer h_between styles={{ margin: '1rem', width: '20rem' }}>
					<label style={{ marginRight: '1rem' }}>Admin</label>
					<div style={{ backgroundColor: '#626262', height: '20px', width: '60px', borderRadius: '5px' }} />
				</FlexContainer>
			</FlexContainer>
			<div className="order-header">
				<h1
					style={{
						textAlign: 'center',
						width: '100%',
						margin: '20px auto',
						justifyContent: 'center'
					}}
				>
					Users
				</h1>
			</div>

			<FlexContainer h_center styles={{ flexWrap: 'wrap' }}>
				{/* <Search setSearchKeyword={setSearchKeyword} submitHandler={submitHandler} category={category} /> */}
				{/* <Sort sortHandler={sortHandler} /> */}
			</FlexContainer>
			<Loading loading={loading} error={error}>
				{users && (
					<div className="order-list responsive_table">
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>
									<th>DATE</th>
									<th>FIRST</th>
									<th>LAST</th>
									<th>EMAIL</th>
									<th>VERIFIED</th>
									<th>ADMIN</th>
									<th>ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr
										key={user._id}
										style={{
											backgroundColor: user.isAdmin
												? colors.admin
												: user.isVerified ? colors.verifid : colors.not_verified
										}}
									>
										<td>{user._id}</td>
										<td>{format_date_display(user.createdAt)}</td>
										<td>{user.first_name}</td>
										<td>{user.last_name}</td>
										<td>{user.email}</td>
										<td>
											{user.isVerified ? (
												<i className="fas fa-check-circle" />
											) : (
												<i className="fas fa-times-circle" />
											)}
										</td>
										<td>
											{user.isAdmin ? (
												<i className="fas fa-check-circle" />
											) : (
												<i className="fas fa-times-circle" />
											)}
										</td>
										<td>
											<FlexContainer h_between>
												<Link to={'/admin/userprofile/' + user._id}>
													<button className="button icon">
														<i className="fas fa-info-circle" />
													</button>
												</Link>
												<button className="button icon" onClick={() => deleteHandler(user)}>
													<i className="fas fa-trash-alt" />
												</button>
											</FlexContainer>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Loading>
		</div>
	);
};
export default UsersPage;
