import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { password_reset } from '../actions/userActions';
import { Title } from '../components/UtilityComponents';
import { FlexContainer } from '../components/ContainerComponents';

const PasswordResetPage = (props) => {
	const [ email, setEmail ] = useState('');
	const userPasswordReset = useSelector((state) => state.userPasswordReset);
	const { loading, userInfo, error } = userPasswordReset;
	const dispatch = useDispatch();

	const [ words, setWords ] = useState('');

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(password_reset(email));
		setWords('Check your Email to Change your Password');
		// props.history.push(redirect);
	};
	return (
		<div className="form">
			<form onSubmit={submitHandler}>
				<ul className="form-container">
					<li>
						{/* <h2>Login</h2> */}
						<h1>Password Reset</h1>
					</li>
					<li>
						{loading ? (
							<FlexContainer h_center column>
								<h2 styles={{ textAlign: 'center' }}>Loading...</h2>
								<h1 styles={{ textAlign: 'center' }}>
									If pages doesn't show in 5 seconds, refresh the page.
								</h1>
							</FlexContainer>
						) : error ? (
							<FlexContainer h_center>
								<h2 styles={{ textAlign: 'center' }}>{error} </h2>
							</FlexContainer>
						) : (
							<h3 styles={{ textAlign: 'center' }}>{words}</h3>
						)}
					</li>
					<li>
						<label htmlFor="email">Email</label>
						<input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
					</li>

					<li>
						<button type="submit" className="button primary">
							Reset Password
						</button>
					</li>
				</ul>
			</form>
		</div>
	);
};
export default PasswordResetPage;
