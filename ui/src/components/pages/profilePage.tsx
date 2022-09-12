import React, { useEffect, useState } from 'react';
import './profilePage.scss';
import ConnectionTile from '../tiles/connectionTile';
import HeaderComponent from '../nav/headerComponent';
import ProfileGeneral from '../myProfile/profileGeneral';
import ProfileNavComponent from '../nav/profile/profileNavComponent';
import { acceptConnectionRequest, getConnectionsForUser, getPendingConnectionsForUser } from '../../utils/rest';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setPreferences } from '../../store/userPreferencesSlice';
import 'primereact/resources/primereact.min.css';

export default function ProfilePage() {
	const dispatch = useDispatch();
	const [selection, setSelection] = useState(1);
	const [connectionsResult, setconnectionsResult] = useState<any>([]);
	const [outgoingResult, setOutgoingResult] = useState<any>([]);
	const [incomingResult, setIncomingResult] = useState<any>([]);
	const [blockedResult, setBlockedResult] = useState<any>([]);

	const noResultsDiv = <div className="no-results-box">nothing at the moment!</div>;
	const preferencesState = useSelector((state: RootState) => state.preferences);
	const userData = useSelector((state: RootState) => state.user.user);

	useEffect(() => {
		fetchExistingConnections();
		fetchPendingConnections();
		setSelection(preferencesState.lastProfileMenu);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchExistingConnections = async () => {
		let httpResults = await getConnectionsForUser(userData.id, 'blank');
		let formattedTiles = httpResults.map((tile: any) => (
			<li className="connection-list-item" style={{ listStyleType: 'none' }} key={tile.id}>
				<ConnectionTile {...tile} type={2}></ConnectionTile>
			</li>
		));
		setconnectionsResult(formattedTiles);
	};

	const fetchPendingConnections = async () => {
		const httpResults = await getPendingConnectionsForUser(userData.id, 'blank');
		const formattedIncomingTiles = httpResults.incoming.map((tile: any) => (
			<li className="connection-list-item" style={{ listStyleType: 'none' }} key={tile.id}>
				<ConnectionTile {...tile} type={3}></ConnectionTile>
			</li>
		));
		const formattedOutgoingTiles = httpResults.outgoing.map((tile: any) => (
			<li className="connection-list-item" style={{ listStyleType: 'none' }} key={tile.id}>
				<ConnectionTile {...tile} type={4}></ConnectionTile>
			</li>
		));
		setOutgoingResult(formattedOutgoingTiles);
		setIncomingResult(formattedIncomingTiles);
	};

	const acceptRequest = async (senderId: number) => {
		const acceptResult = await acceptConnectionRequest(userData.id, senderId, userData.token);
	};

	useEffect(() => {
		changeSelection(preferencesState.lastProfileMenu);
		// eslint-disable-next-line
	}, [preferencesState.lastProfileMenu]);

	const changeSelection = (value: number) => {
		setSelection(value);
		dispatch(
			setPreferences({
				...preferencesState,
				lastProfileMenu: value,
			})
		);
		// localStorage.setItem("lastProfileMenu", JSON.stringify(value));
	};

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<ProfileNavComponent
				selection={selection}
				selectionChanged={(value) => {
					changeSelection(value);
				}}
			></ProfileNavComponent>
			{/* MENU 1- My Prof */}
			{selection === 1 ? (
				<div className="my-profile-container">
					<ProfileGeneral></ProfileGeneral>
				</div>
			) : (
				<></>
			)}
			{/* MENU 2- Connections */}
			{selection === 2 ? <div className="my-profile-container">{connectionsResult}</div> : <></>}
			{/* MENU 3- Incoming */}
			{selection === 3 ? (
				<div className="my-profile-container">{incomingResult.length > 0 ? incomingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 4- Outgoing */}
			{selection === 4 ? (
				<div className="my-profile-container">{outgoingResult.length > 0 ? outgoingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 5- Blocked */}
			{selection === 5 ? (
				<div className="my-profile-container">{blockedResult.length > 0 ? blockedResult : noResultsDiv}</div>
			) : (
				<></>
			)}
		</div>
	);
}
