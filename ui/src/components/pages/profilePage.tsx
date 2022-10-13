import React, { useEffect, useRef, useState } from 'react';
import './profilePage.scss';
import ConnectionTile from '../tiles/connectionTile';
import HeaderComponent from '../nav/headerComponent';
import ProfileGeneral from '../myProfile/profileGeneral';
import { acceptConnectionRequest, getConnectionsForUser, getPendingConnectionsForUser } from '../../utils/rest';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setPreferences } from '../../store/userPreferencesSlice';
import { Menu } from 'primereact/menu';
import 'primereact/resources/primereact.min.css';
import Confetti from 'react-confetti';
import ConversationTile from '../tiles/conversationTile';
import Chat from '../myProfile/chat';

export default function ProfilePage() {
	const rustChatObject = {
		id: 1,
		username: 'rust general',
		avatar_url: 'https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png',
		isPublicChat: 'true',
	};
	const minecraftChatObject = {
		id: 2,
		username: 'minecraft general',
		avatar_url: 'https://res.cloudinary.com/kultured-dev/image/upload/v1665619101/Minecraft_ttasx5.png',
		isPublicChat: 'true',
	};
	const rocketLeagueChatObject = {
		id: 3,
		username: 'rocket league general',
		avatar_url: 'https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png',
		isPublicChat: 'true',
	};
	const dispatch = useDispatch();
	const [selection, setSelection] = useState(1);
	const [chatBox, setChatBox] = useState<any>(<></>);
	const [currentConvo, setCurrentConvo] = useState<any>(rustChatObject);
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
		changeSelection(preferencesState.lastProfileMenu);
		if (userData.id && userData.id > 0) {
			fetchExistingConnections();
			fetchPendingConnections();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setChatboxContents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentConvo]);

	const setChatboxContents = () => {
		setChatBox(<Chat {...currentConvo}></Chat>);
	};

	//BEGIN Fetch Connections
	const fetchExistingConnections = async () => {
		setconnectionsResult(await getConnectionsForUser(userData.id, 'blank'));
		setChatBox(<Chat {...currentConvo}></Chat>);
	};
	const fetchPendingConnections = async () => {
		const httpResults = await getPendingConnectionsForUser(userData.id, 'blank');
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
		setBlockedResult([]);
	};
	//END Fetch Connections

	//BEGIN Chat Logic
	const openConversation = async (tile: any) => {
		setCurrentConvo({
			id: tile.id,
			username: tile.username,
			avatar_url: tile.avatar_url,
			isPublicChat: tile.isPublicChat,
			preferred_platform: tile.preferred_platform,
			currentlyOpenConvo: tile.id,
		});
	};
	//END Chat Logic

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
			2: 'messaging',
			3: 'incoming requests',
			4: 'outgoing requests',
			5: 'blocked',
			6: 'account settings',
			7: 'rust profile',
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
					label: 'rust profile',
					icon: 'pi pi-fw pi-map',
					command: () => {
						changeSelection(7);
					},
				},
				{
					label: 'account settings',
					icon: 'pi pi-fw pi-cog',
					command: () => {
						changeSelection(6);
					},
				},
			],
		},
		{
			label: 'messaging',
			items: [
				{
					label: 'messaging',
					icon: 'pi pi-fw pi-users',
					command: () => {
						changeSelection(2);
					},
				},
			],
		},
		{
			label: 'requests',
			items: [
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

			{/* MENU 2- Connections/ Messaging */}
			{selection === 2 ? (
				<div className="content-container">
					<div className="chat-container">
						<div className="conversations-box">
							<ConversationTile
								key={0.5}
								{...rustChatObject}
								currentlyOpenConvo={currentConvo}
								callOpenConversation={(connectionId: number) => {
									openConversation(connectionId);
								}}
							></ConversationTile>
							<ConversationTile
								key={0.5}
								{...minecraftChatObject}
								currentlyOpenConvo={currentConvo}
								callOpenConversation={(connectionId: number) => {
									openConversation(connectionId);
								}}
							></ConversationTile>
							<ConversationTile
								key={0.5}
								{...rocketLeagueChatObject}
								currentlyOpenConvo={currentConvo}
								callOpenConversation={(connectionId: number) => {
									openConversation(connectionId);
								}}
							></ConversationTile>
							<div key={0.75} className="gradient-bar"></div>
							{connectionsResult.map((tile: any) => (
								<li className="conversation-list-item" style={{ listStyleType: 'none' }} key={tile.id}>
									<ConversationTile
										key={tile.id}
										{...tile}
										currentlyOpenConvo={currentConvo}
										isPublicChat="false"
										callOpenConversation={(connectionId: number) => {
											openConversation(connectionId);
										}}
									></ConversationTile>
								</li>
							))}
						</div>
						{chatBox}
					</div>
				</div>
			) : (
				<></>
			)}
			{/* MENU 3- Incoming Connections */}
			{selection === 3 ? (
				<div className="content-container">{incomingResult.length > 0 ? incomingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 4- Outgoing Connections */}
			{selection === 4 ? (
				<div className="content-container">{outgoingResult.length > 0 ? outgoingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 5- Blocked People */}
			{selection === 5 ? (
				<div className="content-container">{blockedResult.length > 0 ? blockedResult : noResultsDiv}</div>
			) : (
				<></>
			)}
		</div>
	);
}
