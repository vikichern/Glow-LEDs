import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { humanize } from '../../utils/helper_functions';
import { listFeatures } from '../../actions/featureActions';
import { useSelector, useDispatch } from 'react-redux';
import { API_Features } from '../../utils';

const MenuPage = (props) => {
	const pathname = props.match.params.pathname;

	const [ glovers, set_glovers ] = useState([]);
	const [ artists, set_artists ] = useState([]);
	const [ producers, set_producers ] = useState([]);
	const [ vfx, set_vfx ] = useState([]);

	const featureList = useSelector((state) => state.featureList);
	const { features, loading, error } = featureList;
	const dispatch = useDispatch();
	useEffect(() => {
		if (pathname === 'featured') {
			dispatch(listFeatures());
			get_features();
		}

		return () => {};
	}, []);

	const get_features = async () => {
		const { data: glovers } = await API_Features.get_features_by_category('glovers');
		const { data: artists } = await API_Features.get_features_by_category('artists');
		const { data: producers } = await API_Features.get_features_by_category('producers');
		const { data: vfx } = await API_Features.get_features_by_category('vfx');
		console.log({ glovers });
		console.log({ artists });
		console.log({ producers });
		console.log({ vfx });
		set_glovers(glovers);
		set_artists(artists);
		set_producers(producers);
		set_vfx(vfx);
	};

	const determine_menu_items = () => {
		if (pathname === 'gloving') {
			return [
				{ category: 'frosted_diffusers', image: 'https://thumbs2.imgbox.com/1f/c9/qXeP6Rtb_t.jpg' },
				{ category: 'mega_diffuser_caps', image: 'https://thumbs2.imgbox.com/34/a1/fH5sSzCD_t.jpg' },
				{ category: 'diffuser_caps', image: 'https://thumbs2.imgbox.com/77/69/NeANPFC2_t.jpg' },
				{ category: 'accessories', image: 'https://thumbs2.imgbox.com/68/f6/GBGPpTs0_t.jpg' }
			];
		} else if (pathname === 'mega_diffuser_caps') {
			return [
				{ category: 'geometric', image: '' },
				{ category: 'shapes', image: '' },
				{ category: 'abstract', image: '' },
				{ category: 'patterns', image: '' }
			];
		} else if (pathname === 'diffuser_caps') {
			return [
				{ category: 'geometric', image: '' },
				{ category: 'shapes', image: '' },
				{ category: 'abstract', image: '' },
				{ category: 'patterns', image: '' },
				{ category: 'emojis', image: '' }
			];
		} else if (pathname === 'decor') {
			return [
				{ category: 'glow_strings', image: 'https://thumbs2.imgbox.com/68/f6/GBGPpTs0_t.jpg' }
				// { category: 'infinity_mirrors', image: 'https://thumbs2.imgbox.com/77/94/3IXh3RtO_t.jpg' }
			];
		} else if (pathname === 'community') {
			return [
				{ category: 'featured', image: 'https://thumbs2.imgbox.com/a0/9b/65wgCsF2_t.png' },
				{ category: 'music', image: 'https://thumbs2.imgbox.com/ea/82/nqDcxRmr_t.jpg' }
			];
		} else if (pathname === 'support') {
			return [
				{ category: 'about', image: 'https://thumbs2.imgbox.com/c2/39/oRHFB0qz_t.jpeg' },
				{ category: 'faq', image: 'https://thumbs2.imgbox.com/9c/ed/jGyCTlQB_t.png' },
				{ category: 'contact', image: 'https://thumbs2.imgbox.com/6b/a4/JLxNKDWE_t.png' },
				{ category: 'terms', image: 'https://thumbs2.imgbox.com/a0/11/BlKmYy5J_t.png' }
			];
		} else if (pathname === 'featured') {
			console.log({ producers });
			return [
				{
					category: 'glovers',
					image: `http://img.youtube.com/vi/${glovers[0] && glovers[0].video}/hqdefault.jpg`,
					artist_name: glovers[0] && glovers[0].artist_name,
					product: glovers[0] && glovers[0].product
				},
				// {
				// 	category: 'artists',
				// 	image: '',
				// 	artist_name: artists[0] && artists[0].artist_name,
				// 	link: artists[0] && artists[0].link
				// },
				{
					category: 'producers',
					image: producers[0] && producers[0].logo,
					artist_name: producers[0] && producers[0].artist_name,
					link: producers[0] && producers[0].link
				}
				// {
				// 	category: 'vfx',
				// 	image: '',
				// 	artist_name: vfx[0] && vfx[0].artist_name,
				// 	link: vfx[0] && vfx[0].link
				// }
			];
		}
	};

	const decide_url = (item) => {
		if (pathname === 'gloving' || pathname === 'decor') {
			return `/collections/all/products/category/${item.category}`;
		} else if (pathname === 'featured') {
			return `/collections/all/features/category/${item.category}`;
		} else {
			return `/pages/${item.category}`;
		}
	};

	return (
		<div className="main_container p-20px">
			<Helmet>
				<title>{humanize(pathname)} | Glow LEDs</title>
				<meta property="og:title" content={`${humanize(pathname)}| Glow LEDs`} />
				<meta name="twitter:title" content={`${humanize(pathname)}| Glow LEDs`} />
				<link rel="canonical" href="https://www.glow-leds.com/pages/featured" />
				<meta property="og:url" content="https://www.glow-leds.com/pages/featured" />
				<meta
					name="description"
					content="Here at Glow LEDs we want all you glovers, ravers, festival goers, and even home decor peeps to be apart of our community."
				/>
				<meta
					property="og:description"
					content="Here at Glow LEDs we want all you glovers, ravers, festival goers, and even home decor peeps to be apart of our community."
				/>
				<meta
					name="twitter:description"
					content="Here at Glow LEDs we want all you glovers, ravers, festival goers, and even home decor peeps to be apart of our community."
				/>
			</Helmet>
			<Link to="/account/login?redirect=/secure/account/submit_feature" className="jc-fe">
				<button className="btn secondary ">Submit Feature</button>
			</Link>
			<div className="jc-c">
				<h1> {humanize(pathname)}</h1>
			</div>
			<div className="jc-c">
				<div className="jc-c wrap">
					{features &&
						determine_menu_items().map((item) => {
							return (
								<div className="home_page_divs m-10px ">
									<Link to={decide_url(item)}>
										<h2 className="">{humanize(item.category)}</h2>
										<div className="w-300px h-300px mb-1rem">
											<img
												className="w-100per h-auto br-20px"
												width="300px"
												height="300px"
												style={{ objectFit: 'cover' }}
												src={item.image}
												alt={item.category}
												title="Menu Item Images"
											/>
										</div>
									</Link>
									<div className="feature_text w-100per ta-c" style={{ fontSize: '1.6rem' }}>
										{item.artist_name && item.artist_name}
									</div>
									<div className="feature_text w-100per ta-c" style={{ fontSize: '1.3rem' }}>
										{item.product && item.product}
										{item.link && item.link}
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};
export default MenuPage;
