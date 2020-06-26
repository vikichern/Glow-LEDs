import React, { useEffect } from 'react';
import { Title, Label } from '../components/UtilityComponents';
import { FlexContainer } from '../components/ContainerComponents';
import { useDispatch, useSelector } from 'react-redux';
import { verify } from '../actions/userActions';

function VerifiedPage(props) {
	const dispatch = useDispatch();
	const userVerify = useSelector((state) => state.userVerify);
	const { loading, userInfo, error } = userVerify;
	useEffect(() => {
		console.log(props.match.params.id);
		dispatch(verify(props.match.params.id));
		if (!loading) {
			props.history.push('/login');
		}

		return () => {};
	}, []);

	return (
		<FlexContainer h_center column>
			<Title styles={{ fontSize: 25, justifyContent: 'center' }}>Thank You for Verifing your Account.</Title>
			<Title styles={{ fontSize: 20, justifyContent: 'center' }}>
				You will be redirected to the login screen shortly.
			</Title>
			<FlexContainer h_center>
				{loading && (
					<div>
						<Title styles={{ fontSize: 25, justifyContent: 'center' }}>Loading...</Title>
						<Title styles={{ fontSize: 20, justifyContent: 'center' }}>
							If pages doesn't show in 5 seconds, refresh the page.
						</Title>
					</div>
				)}
				{error && <Title styles={{ fontSize: 20 }}>{error}</Title>}
			</FlexContainer>
		</FlexContainer>
	);
}
export default VerifiedPage;
