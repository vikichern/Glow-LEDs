import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listTeams, deleteTeam } from '../../actions/teamActions';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/UtilityComponents';
import { Helmet } from 'react-helmet';
import { Search, Sort } from '../../components/SpecialtyComponents';

const TeamsPage = (props) => {
	const [ searchKeyword, setSearchKeyword ] = useState('');
	const [ sortOrder, setSortOrder ] = useState('');
	const category = props.match.params.category ? props.match.params.category : '';
	const teamList = useSelector((state) => state.teamList);
	const { loading, teams, error } = teamList;

	const teamSave = useSelector((state) => state.teamSave);
	const { success: successSave } = teamSave;

	const teamDelete = useSelector((state) => state.teamDelete);
	const { success: successDelete } = teamDelete;
	const dispatch = useDispatch();

	const stableDispatch = useCallback(dispatch, []);
	useEffect(
		() => {
			stableDispatch(listTeams());
			return () => {
				//
			};
		},
		[ successSave, successDelete, stableDispatch ]
	);
	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(listTeams(category, searchKeyword, sortOrder));
	};

	const sortHandler = (e) => {
		setSortOrder(e.target.value);
		dispatch(listTeams(category, searchKeyword, e.target.value));
	};

	useEffect(
		() => {
			stableDispatch(listTeams(category, searchKeyword, sortOrder));
		},
		[ stableDispatch, category, searchKeyword, sortOrder ]
	);
	const deleteHandler = (team) => {
		dispatch(deleteTeam(team._id));
	};

	const sort_options = [ 'Newest', 'Artist Name', 'Facebook Name', 'Instagram Handle', 'Sponsor', 'Promoter' ];

	const colors = [ { name: 'Sponsor', color: '#3e4c6d' }, { name: 'Promoter', color: '#7d5555' } ];

	const determine_color = (team) => {
		let result = '';

		if (team.sponsor) {
			result = colors[0].color;
		}
		if (team.promoter) {
			result = colors[1].color;
		}
		return result;
	};

	return (
		<div className="main_container p-20px">
			<Helmet>
				<title>Admin Teams | Glow LEDs</title>
			</Helmet>
			<div className="wrap jc-b">
				<div className="wrap jc-b">
					{colors.map((color) => {
						return (
							<div className="wrap jc-b  m-1rem">
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
				<Link to="/secure/glow/editteam">
					<button className="btn primary" style={{ width: '160px' }}>
						Create Team
					</button>
				</Link>
			</div>
			<div className="jc-c">
				<h1 style={{ textAlign: 'center' }}>Teams</h1>
			</div>
			<div className="search_and_sort row jc-c ai-c" style={{ overflowX: 'scroll' }}>
				<Search setSearchKeyword={setSearchKeyword} submitHandler={submitHandler} category={category} />
				<Sort sortHandler={sortHandler} sort_options={sort_options} />
			</div>
			<Loading loading={loading} error={error}>
				{teams && (
					<div className="team-list responsive_table">
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Team Name</th>
									<th>Instagram Handle</th>
									<th>Facebook Name</th>
									<th>Percentage Off</th>
									<th>Venmo</th>
									<th>Promo Code</th>
									<th>Sponsor</th>
									<th>Promotor</th>
									<th>active</th>
								</tr>
							</thead>
							<tbody>
								{teams.map((team) => (
									<tr
										key={team._id}
										style={{
											backgroundColor: determine_color(team),
											fontSize: '1.4rem'
										}}
									>
										<td className="p-10px">{team._id}</td>
										<td className="p-10px">{team.team_name}</td>
										<td className="p-10px">{team.instagram_handle}</td>
										<td className="p-10px">{team.facebook_name}</td>
										<td className="p-10px">{team.percentage_off}%</td>
										<td className="p-10px">{team.venmo}</td>
										<td className="p-10px">{team.promo_code}</td>
										<td className="p-10px">
											{team.sponsor ? (
												<i className="fas fa-check-circle" />
											) : (
												<i className="fas fa-times-circle" />
											)}
										</td>
										<td className="p-10px">
											{team.promoter ? (
												<i className="fas fa-check-circle" />
											) : (
												<i className="fas fa-times-circle" />
											)}
										</td>
										<td className="p-10px">
											{team.active ? (
												<i className="fas fa-check-circle" />
											) : (
												<i className="fas fa-times-circle" />
											)}
										</td>
										<td className="p-10px">
											<div className="jc-b">
												<Link to={'/secure/glow/editteam/' + team.pathname}>
													<button className="btn icon">
														<i className="fas fa-edit" />
													</button>
												</Link>
												<button className="btn icon" onClick={() => deleteHandler(team)}>
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
export default TeamsPage;
