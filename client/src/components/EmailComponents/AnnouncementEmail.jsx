import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useSelector, useDispatch } from 'react-redux';
import { FlexContainer } from '../../components/ContainerComponents/index';

import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { detailsEmail, listEmails } from '../../actions/emailActions';

const AnnouncementEmail = () => {
	const emailDetails = useSelector((state) => state.emailDetails);
	const { email, loading, error } = emailDetails;

	const emailList = useSelector((state) => state.emailList);
	const { loading: loading_emails, emails, error: error_emails } = emailList;

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(listEmails());
		return () => {};
	}, []);

	useEffect(
		() => {
			const active_email = emails.find((email) => email.active === true);
			if (active_email) {
				dispatch(detailsEmail(active_email._id));
			}
			return () => {};
		},
		[ emails ]
	);

	const jsx = (
		<div>
			{email &&
			email.announcement && (
				<div style={{ fontFamily: 'helvetica', height: '100%', margin: '0px', padding: '0px', width: '100%' }}>
					<div style={{ backgroundColor: '#333333', padding: '20px' }}>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<img
								src="https://images2.imgbox.com/63/e7/BPGMUlpc_o.png"
								alt="Glow LEDs"
								style={{
									textAlign: 'center',
									height: 'auto',
									maxWidth: '500px',
									width: '100%',
									marginRight: '20px'
								}}
							/>
						</div>
						<h4
							style={{
								textAlign: 'center',
								fontFamily: 'helvetica',
								width: '100%',
								margin: '0 auto',
								lineHeight: '50px',
								color: 'white',
								fontSize: '2em'
							}}
						>
							{email.announcement && email.announcement.h1}
						</h4>
					</div>
					<div style={{ backgroundColor: '#5f5f5f', padding: '20px' }}>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							{email.announcement.show_image && (
								<img
									src={email.announcement && email.announcement.image}
									alt="Glow LEDs"
									style={{
										textAlign: 'center',
										height: 'auto',
										maxWidth: '900px',
										width: '100%',
										borderRadius: '20px'
									}}
								/>
							)}
							{email.announcement.show_video && (
								<FlexContainer h_center styles={{ position: 'relative' }}>
									<div className="iframe-container">
										<iframe
											title={email.announcement && email.announcement.h1}
											width="996"
											height="560"
											style={{ borderRadius: '20px' }}
											src={`https://www.youtube.com/embed/${email.announcement
												.video}?mute=1&showinfo=0&rel=0&autoplay=1&loop=1`}
											frameborder="0"
											allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen="1"
										/>
									</div>
								</FlexContainer>
							)}
						</div>
						<h4
							style={{
								textAlign: 'center',
								fontFamily: 'helvetica',
								color: 'white',
								fontSize: '1.5em',
								marginTop: '20px',
								marginBottom: '0'
							}}
						>
							{email.announcement && email.announcement.h2}
						</h4>
						<p
							style={{
								fontSize: '16px',
								lineHeight: '30px',
								maxWidth: '800px',
								width: '100%',
								margin: '20px auto',
								color: 'white'
							}}
						>
							{email.announcement && email.announcement.p}
						</p>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center'
							}}
						>
							<a
								src={email.announcement && email.announcement.link}
								alt="discount image"
								style={{
									backgroundColor: '#4c4f60',
									color: 'white',
									borderRadius: '10px',
									border: 0,
									padding: '15px'
								}}
							>
								<h4
									style={{
										fontFamily: 'helvetica',
										margin: 0,
										fontSize: '1.2em',
										textAlign: 'center'
									}}
								>
									{email.announcement && email.announcement.button}
								</h4>
							</a>
						</div>
					</div>
					<div style={{ backgroundColor: '#333333', padding: '20px' }}>
						<div
							style={{
								marginLeft: '10px',
								display: 'flex',
								justifyContent: 'space-between',
								maxWidth: '250px',
								width: '100%',
								margin: '0 auto',
								color: 'white'
							}}
						>
							<div
								style={{
									fontSize: '30px',
									color: 'white'
								}}
							>
								<a
									rel="noreferrer"
									href="https://www.facebook.com/Glow-LEDscom-100365571740684"
									target="_blank"
									rel="noopener noreferrer"
								>
									<i class="fab fa-facebook zoom" style={{ color: 'white' }} />
								</a>
							</div>
							<div
								style={{
									fontSize: '30px',
									color: 'white'
								}}
							>
								<a
									rel="noreferrer"
									href="https://www.instagram.com/glow_leds/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<i class="fab fa-instagram zoom" style={{ color: 'white' }} />
								</a>
							</div>
							<div
								style={{
									fontSize: '30px',
									color: 'white'
								}}
							>
								<a
									rel="noreferrer"
									href="https://www.youtube.com/channel/UCm_gDyTIy7d0oR9LeowPkYw"
									target="_blank"
									rel="noopener noreferrer"
								>
									<i class="fab fa-youtube zoom" style={{ color: 'white' }} />
								</a>
							</div>
							<div
								style={{
									fontSize: '30px',
									color: 'white'
								}}
							>
								<a
									rel="noreferrer"
									href="https://soundcloud.com/ntre/tracks"
									target="_blank"
									rel="noopener noreferrer"
								>
									<i class="fab fa-soundcloud" style={{ color: 'white' }} />
								</a>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px white solid',
								maxWidth: '600px',
								width: '100%',
								margin: '15px auto'
							}}
						/>
						{/* <p style={{ textAlign: 'center' }}>Copyright © 2020 Throwlights, Inc., All rights reserved.</p> */}
						<p style={{ textAlign: 'center', fontSize: '14px', color: 'white' }}>
							Our mailing address is: <br />404 Kenniston Dr Apt D, Austin, TX 78752{' '}
						</p>
						<p style={{ textAlign: 'center', fontSize: '14px', color: 'white' }}>
							Want to change how you receive these emails? <br /> You can{' '}
							<a
								rel="noreferrer"
								href="https://www.glow-leds.com/collections/all/products/category/frosted_diffusers"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									textDecoration: 'underline',
									color: 'white'
								}}
							>
								update your preferences
							</a>{' '}
							or{' '}
							<a
								rel="noreferrer"
								href="https://www.glow-leds.com/collections/all/products/category/frosted_diffusers"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									textDecoration: 'underline',
									color: 'white'
								}}
							>
								unsubscribe{' '}
							</a>
							from this list.
						</p>
					</div>
				</div>
			)}
		</div>
	);

	const htmlString = ReactDOMServer.renderToStaticMarkup(jsx);
	console.log({ htmlString });
	return jsx;
};

export default AnnouncementEmail;
