import React from 'react';
import FlexContainer from './FlexContainer';
import { Link } from 'react-router-dom';

const Footer = (props) => {
	return (
		<footer
			className="ta-c w-100per mt-90px ai-c jc-c left-0px bottom-0px"
			style={{ backgroundColor: props.backgroundColor }}
		>
			<div className="jc-b ai-c w-100per">
				{/* <label styles={{ margin: 'auto' }}>© 2020 Glow LEDs. All Rights Reserved</label> */}
				<div className="ml-10px wrap">
					<Link to="/pages/contact">
						<button className="button mobile_nav m-auto mr-10px">Contact</button>
					</Link>
					<Link to="/pages/terms">
						<button className="button mobile_nav m-auto mr-10px">Terms</button>
					</Link>
					<Link to="/pages/sitemap">
						<button className="button mobile_nav m-auto">Sitemap</button>
					</Link>
				</div>
				<div className="ml-8px wrap">
					<div className="ml-10px fs-30px">
						<a
							rel="noreferrer"
							href="https://www.facebook.com/Glow-LEDscom-100365571740684"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i class="fab fa-facebook zoom" />
						</a>
					</div>
					<div className="ml-10px fs-30px">
						<a
							rel="noreferrer"
							href="https://www.instagram.com/glow_leds/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i class="fab fa-instagram zoom" />
						</a>
					</div>
					<div className="mh-10px fs-30px">
						<a
							rel="noreferrer"
							href="https://www.youtube.com/channel/UCm_gDyTIy7d0oR9LeowPkYw"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i class="fab fa-youtube zoom" />
						</a>
					</div>
					<div className="mr-10px fs-30px">
						<a
							rel="noreferrer"
							href="https://soundcloud.com/ntre"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i class="fab fa-soundcloud" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
