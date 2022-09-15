import React, { useEffect, useRef, useState } from 'react';
import './profilePage.scss';
import ConnectionTile from '../tiles/connectionTile';
import HeaderComponent from '../nav/headerComponent';
import ProfileGeneral from '../myProfile/profileGeneral';
import ProfileNavComponent from '../nav/profile/profileNavComponent';
import { acceptConnectionRequest, getConnectionsForUser, getPendingConnectionsForUser } from '../../utils/rest';
import FooterComponent from '../nav/footerComponent';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setPreferences } from '../../store/userPreferencesSlice';
import { Menu } from 'primereact/menu';
import 'primereact/resources/primereact.min.css';

import Confetti from 'react-confetti';

export default function ProfilePage() {
	const dispatch = useDispatch();
	const [selection, setSelection] = useState(1);
	const [connectionsResult, setconnectionsResult] = useState<any>([]);
	const [outgoingResult, setOutgoingResult] = useState<any>([]);
	const [incomingResult, setIncomingResult] = useState<any>([]);
	const [blockedResult, setBlockedResult] = useState<any>([]);
	const [isConfetti, setIsConfetti] = useState<any>(false);
	const [submenuTitle, setSubmenuTitle] = useState<any>('');

	const noResultsDiv = <div className="no-results-box">nothing at the moment!</div>;
	const preferencesState = useSelector((state: RootState) => state.preferences);
	const userData = useSelector((state: RootState) => state.user.user);

	useEffect(() => {
		fetchExistingConnections();
		fetchPendingConnections();
		setSelection(preferencesState.lastProfileMenu);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//BEGIN Fetch Connections
	const fetchExistingConnections = async () => {
		let httpResults = await getConnectionsForUser(userData.id, 'blank');
		let formattedTiles = httpResults.map((tile: any) => (
			<li className="connection-list-item" style={{ listStyleType: 'none' }} key={tile.id}>
				<ConnectionTile
					{...tile}
					type={2}
					callAcceptRequest={(senderId: number, requestId: number) => {
						acceptRequest(senderId, requestId);
					}}
				></ConnectionTile>
			</li>
		));
		setconnectionsResult(formattedTiles);
	};
	const fetchPendingConnections = async () => {
		const httpResults = await getPendingConnectionsForUser(userData.id, 'blank');
		console.log(' incoming ', httpResults);
		const formattedIncomingTiles = httpResults.incoming.map((tile: any) => (
			<li className="connection-list-item" style={{ listStyleType: 'none' }} key={tile.id}>
				<ConnectionTile
					{...tile}
					type={3}
					callAcceptRequest={(senderId: number, requestId: number) => {
						acceptRequest(senderId, requestId);
					}}
				></ConnectionTile>
			</li>
		));
		const formattedOutgoingTiles = httpResults.outgoing.map((tile: any) => (
			<li className="connection-list-item" style={{ listStyleType: 'none' }} key={tile.id}>
				<ConnectionTile
					{...tile}
					type={4}
					callAcceptRequest={(senderId: number, requestId: number) => {
						acceptRequest(senderId, requestId);
					}}
				></ConnectionTile>
			</li>
		));
		setOutgoingResult(formattedOutgoingTiles);
		setIncomingResult(formattedIncomingTiles);
	};
	//END Fetch Connections

	//BEGIN Social Actions Logic
	const acceptRequest = async (senderId: number, requestId: number) => {
		const acceptResult = await acceptConnectionRequest(userData.id, senderId, 1, requestId, userData.token);
		const blastConfetti = async () => {
			setTimeout(function () {
				setIsConfetti(false);
			}, 4000);
		};
		if (acceptResult && acceptResult[1] === 1) {
			setIsConfetti(true);
			await blastConfetti();
			fetchPendingConnections();
			fetchExistingConnections();
		}
	};
	//END Social Actions Logic

	//BEGIN Nav logic
	useEffect(() => {
		changeSelection(preferencesState.lastProfileMenu);
		// eslint-disable-next-line
	}, [preferencesState.lastProfileMenu]);

	const changeSelection = (value: number) => {
		const menuTitleKey: any = {
			1: 'general profile',
			2: 'connections',
			3: 'incoming',
			4: 'outgoing',
			5: 'blocked',
			6: 'account settings',
			7: 'rust settings',
		};
		setSubmenuTitle(menuTitleKey[value]);
		setSelection(value);
		dispatch(
			setPreferences({
				...preferencesState,
				lastProfileMenu: value,
			})
		);
	};
	//END Nav logic
	const width = 1920;
	const height = 1080;

	//BEGIN Nav Variables
	const menu: any = useRef(null);
	const navItems = [
		{
			label: 'profile',
			items: [
				{
					label: 'general profile',
					icon: 'pi pi-fw pi-user',
					command: () => {
						changeSelection(1);
					},
				},
				{
					label: 'account settings',
					icon: 'pi pi-fw pi-cog',
					command: () => {
						changeSelection(6);
					},
				},
				{
					label: 'rust settings',
					icon: 'pi pi-fw pi-sliders-h',
					command: () => {
						changeSelection(7);
					},
				},
			],
		},
		{
			label: 'social',
			items: [
				{
					label: 'connections',
					icon: 'pi pi-fw pi-users',
					command: () => {
						changeSelection(2);
					},
				},
				{
					label: 'incoming',
					icon: 'pi pi-fw pi-arrow-circle-up',
					command: () => {
						changeSelection(3);
					},
				},
				{
					label: 'outgoing',
					icon: 'pi pi-fw pi-arrow-circle-down',
					command: () => {
						changeSelection(4);
					},
				},
				{
					label: 'blocked',
					icon: 'pi pi-fw pi-ban',
					command: () => {
						changeSelection(5);
					},
				},
			],
		},
	];
	//END Nav Variables

	return (
		<div>
			{isConfetti ? (
				<Confetti
					numberOfPieces={isConfetti ? 500 : 0}
					recycle={false}
					width={width}
					height={height}
					tweenDuration={1000}
				/>
			) : (
				<></>
			)}
			<HeaderComponent></HeaderComponent>
			{/* <ProfileNavComponent
				selection={selection}
				selectionChanged={(value) => {
					changeSelection(value);
				}}
			></ProfileNavComponent> */}
			{/* MENU 1- My Prof */}
			<div className="nav-menu">
				<Menu model={navItems} popup ref={menu} id="popup_menu" />
				<button className="submenu-navigator" onClick={(event) => menu.current.toggle(event)}>
					<i className="pi pi-bars" />
				</button>
				<div className="submenu-title">{submenuTitle}</div>
			</div>

			<div className="content-container" style={{ display: [1, 6, 7].includes(selection) ? 'flex' : 'none' }}>
				<ProfileGeneral submenuId={selection}></ProfileGeneral>
			</div>

			{/* MENU 2- Connections */}
			{selection === 2 ? (
				<div className="content-container">{connectionsResult.length > 0 ? connectionsResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 3- Incoming */}
			{selection === 3 ? (
				<div className="content-container">{incomingResult.length > 0 ? incomingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 4- Outgoing */}
			{selection === 4 ? (
				<div className="content-container">{outgoingResult.length > 0 ? outgoingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 5- Blocked */}
			{selection === 5 ? (
				<div className="content-container">{blockedResult.length > 0 ? blockedResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			<FooterComponent></FooterComponent>
		</div>
	);
}
