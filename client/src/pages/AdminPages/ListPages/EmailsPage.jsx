import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listEmails, deleteEmail, saveEmail } from '../../../actions/emailActions';
import { Link, useHistory } from 'react-router-dom';
import { Loading, Notification } from '../../../components/UtilityComponents';
import { Helmet } from 'react-helmet';
import { Search, Sort } from '../../../components/SpecialtyComponents';
import { accurate_date, format_date, format_time, humanize, unformat_date, unformat_date_and_time } from '../../../utils/helper_functions';
import { API_Emails } from '../../../utils';

const EmailsPage = (props) => {
	const history = useHistory();
	const [ search, set_search ] = useState('');
	const [ sort, setSortOrder ] = useState('');
	const [ loading_checkboxes, set_loading_checkboxes ] = useState(true);
	const [ test, set_test ] = useState(true);
	const [ subject, set_subject ] = useState('');
	const [ email, set_email ] = useState({});
	
	const category = props.match.params.category ? props.match.params.category : '';
	const emailList = useSelector((state) => state.emailList);
	const { loading, emails, message, error } = emailList;

	const emailSave = useSelector((state) => state.emailSave);
	const { success: successSave } = emailSave;

	const emailDelete = useSelector((state) => state.emailDelete);
	const { success: successDelete } = emailDelete;
	const dispatch = useDispatch();

	const today = new Date();


	const [ date, set_date ] = useState(format_date(accurate_date(today)));
	const [ time, set_time ] = useState(format_time(accurate_date(today)));

	useEffect(
		() => {
			let clean = true;
			if (clean) {
				dispatch(listEmails({}));
				get_last_active_email()
			}
			return () => (clean = false);
		},
		[ successSave, successDelete, dispatch ]
	);

	const get_last_active_email = async () => {
			const {data} = await API_Emails.get_last_active_email()
			console.log({data: data[0]})
			set_email(data[0])
	}
	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(listEmails({ category, search, sort }));
	};

	const sortHandler = (e) => {
		setSortOrder(e.target.value);
		dispatch(listEmails({ category, search, sort: e.target.value }));
	};

	useEffect(
		() => {
			let clean = true;
			if (clean) {
				dispatch(listEmails({ category, search, sort }));
			}
			return () => (clean = false);
		},
		[ dispatch, category, search, sort ]
	);
	const deleteHandler = (email) => {
		dispatch(deleteEmail(email._id));
	};

	const colors = [ { name: 'Announcements', color: '#7d5555' }, { name: 'General', color: '#3e4c6d' } ];

	const determine_color = (email) => {
		let result = '';
		if (email.email_type === 'Announcements') {
			result = colors[0].color;
		} else {
			result = colors[1].color;
		}
		console.log(result);
		return result;
	};

	const change_email_status = (email) => {
		dispatch(
			saveEmail({
				...email,
				active: email.active ? false : true
			})
		);
		dispatch(listEmails({}));
		dispatch(listEmails({}));
	};

	const sort_options = [ 'Email Type' ];

	const templates = [
		'announcement',
		'review',
		'account_created',
		'reset_password',
		'password_reset',
		'email_subscription',
		'order',
		'review',
		'affiliate',
		'feature',
		'contact',
		'contact_confirmation',
		'account_created'
	];

	const [ link, set_link ] = useState('announcement');

	const send_announcement_email = async () => {
		const data = await API_Emails.send_announcement_email(email, subject ? subject : email.h1, test, unformat_date_and_time(date, time));
		console.log('Announcement Email Sent Successfully');
		console.log(data);
	};

	setTimeout(() => {
		set_loading_checkboxes(false);
	}, 500);
	return (
		<div className="main_container p-20px">
			<Helmet>
				<title>Admin Emails | Glow LEDs</title>
			</Helmet>
			<Notification message={message} />
			<div className="wrap jc-b ai-c">
				<div className="ai-c h-25px mv-15px jc-c">
					<div className="custom-select">
						<select className="qty_select_dropdown" onChange={(e) => set_link(e.target.value)}>
							<option key={1} defaultValue="">
								---Choose Email Template---
							</option>
							{templates.map((item, index) => (
								<option key={index} value={item}>
									{humanize(item)}
								</option>
							))}
						</select>
						<span className="custom-arrow" />
					</div>
					<a href={'/api/templates/' + link} rel="noreferrer" target="_blank" className="ml-10px">
						<button className="btn primary">{humanize(link)}</button>
					</a>
				</div>
				<input type="text" placeholder="Subject" onChange={(e) => set_subject(e.target.value)} />
				<input type="text" value={date} onChange={(e) => set_date(e.target.value)} />
				<input type="text" value={time} onChange={(e) => set_time(e.target.value)} />
				{loading_checkboxes ? (
					<div>Loading...</div>
				) : (
					<div>
						<label htmlFor="test">Test</label>
						<input
							type="checkbox"
							name="test"
							defaultChecked={test}
							id="test"
							onChange={(e) => {
								set_test(e.target.checked);
							}}
						/>
					</div>
				)}
			<button className="btn primary mb-1rem" onClick={() => send_announcement_email()}>
					Send Announcement Email
				</button>
				<Link to="/secure/glow/editemail">
				<button className="btn primary">Create Email</button>
			</Link> 
			</div>
			
			<div className="wrap jc-b">
				{colors.map((color, index) => {
					return (
						<div className="wrap jc-b m-1rem" key={index}>
							<label style={{ marginRight: '1rem' }}>{color.name}</label>
							<div
								style={{
									backgroundColor: color.color,
									height: '20px',
									width: '60px',
									borderRadius: '5px'
								}}
							/>
						</div>
					);
				})}
			</div>
			<div className="jc-c">
				<h1 style={{ textAlign: 'center' }}>Emails</h1>
			</div>
			<div className="search_and_sort row jc-c ai-c" style={{ overflowX: 'scroll' }}>
				<Search search={search} set_search={set_search} submitHandler={submitHandler} category={category} />
				<Sort sortHandler={sortHandler} sort_options={sort_options} />
			</div>
			<Loading loading={loading} error={error}>
				{emails && (
					<div className="email-list responsive_table">
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>

									<th>Email Type</th>
									<th>H1</th>
									<th>Show Image</th>
									<th>H2</th>
									<th>Button</th>
									<th>Active</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{emails.map((email, index) => (
									<tr
										key={index}
										style={{
											backgroundColor: determine_color(email),
											fontSize: '16px'
										}}
									>
										<td className="p-10px">{email._id}</td>
										<td className="min-w-16rem p-10px">{email.email_type}</td>
										<td className="p-10px">{email.h1}</td>
										<td className="min-w-14rem p-10px">
											{email.show_image ? (
												<i className="fas fa-check-circle" />
											) : (
												<i className="fas fa-times-circle" />
											)}
										</td>
										<td className="p-10px">{email.h2}</td>
										<td className="p-10px">{email.button}</td>
										<td className="p-10px">
											<button className="btn icon" onClick={() => change_email_status(email)}>
												{email.active ? (
													<i className="fas fa-check-circle" />
												) : (
													<i className="fas fa-times-circle" />
												)}
											</button>
										</td>
										<td className="p-10px">
											<div className="jc-b">
												<Link to={'/secure/glow/editemail/' + email._id}>
													<button className="btn icon" aria-label="Edit">
														<i className="fas fa-edit" />
													</button>
												</Link>
												<button
													className="btn icon"
													onClick={() => deleteHandler(email)}
													aria-label="Delete"
												>
													<i className="fas fa-trash-alt" />
												</button>
											</div>
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
export default EmailsPage;
