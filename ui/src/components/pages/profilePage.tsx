import React, { useEffect, useState } from 'react';
import './profilePage.scss';
import ConnectionTile from '../tiles/connectionTile';
import HeaderComponent from '../nav/headerComponent';
import ProfileGeneral from '../myProfile/profileGeneral';
import { acceptConnectionRequest, getConnectionsForUser, getPendingConnectionsForUser } from '../../utils/rest';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import 'primereact/resources/primereact.min.css';
import Confetti from 'react-confetti';
import ConversationTile from '../tiles/conversationTile';
import Chat from '../myProfile/chat';
import { useLocation, useNavigate } from 'react-router-dom';
import BannerTitle from '../nav/banner-title';
import ProfileRust from '../myProfile/profileRust';
import ProfileRocketLeague from '../myProfile/profileRocketLeague';
import ProfileWidgetsContainer from '../myProfile/profileWidgetsContainer';
import AccountSettings from '../myProfile/profileAccountSettings';

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
	const navigate = useNavigate();

	// Location Variables
	const locationPath: string = useLocation().pathname;
	const gameProfilePaths: string[] = ['/rust-profile', '/rocket-league-profile'];
	const menuTitleKey: any = {
		'/general-profile': 'general profile',
		'/messaging': 'messaging',
		'/incoming-requests': 'incoming requests',
		'/outgoing-requests': 'outgoing requests',
		'/blocked': 'blocked',
		'/account-settings': 'account settings',
		'/rust-profile': 'rust profile',
		'/rocket-league-profile': 'rocket league profile',
	};
	const menuTitle = menuTitleKey[locationPath];

	const [bannerImageUrl, setbannerImageUrl] = useState<string>(
		'https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png'
	);
	const [chatBox, setchatBox] = useState<any>(<></>);
	const [currentConvo, setCurrentConvo] = useState<any>(rustChatObject);
	const [connectionsResult, setconnectionsResult] = useState<any>([]);
	const [outgoingResult, setOutgoingResult] = useState<any>([]);
	const [incomingResult, setIncomingResult] = useState<any>([]);
	const [blockedResult, setBlockedResult] = useState<any>([]);
	const [isConfetti, setIsConfetti] = useState<any>(false);

	const noResultsDiv = <div className='no-results-box'>nothing at the moment!</div>;
	const userData = useSelector((state: RootState) => state.user.user);

	useEffect(() => {
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

	const changeBannerImage = (newuRL: string) => {
		setbannerImageUrl(newuRL);
	};

	const setChatboxContents = () => {
		setchatBox(<Chat {...currentConvo}></Chat>);
	};

	//BEGIN Fetch Connections
	const fetchExistingConnections = async () => {
		setconnectionsResult(await getConnectionsForUser(userData.id, 'blank'));
		setChatboxContents();
	};
	const fetchPendingConnections = async () => {
		const httpResults = await getPendingConnectionsForUser(userData.id, 'blank');
		const formattedIncomingTiles = httpResults.incoming.map((tile: any) => (
			<li className='connection-list-item' style={{ listStyleType: 'none' }} key={tile.id}>
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
			<li className='connection-list-item' style={{ listStyleType: 'none' }} key={tile.id}>
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
			user_id: tile.user_id,
			username: tile.username,
			avatar_url: tile.avatar_url,
			isPublicChat: tile.isPublicChat,
			preferred_platform: tile.preferred_platform,
			currentlyOpenConvo: tile.id,
			discord: tile.discord,
			psn: tile.psn,
			xbox: tile.xbox,
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

	const width = 1920;
	const height = 1080;

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
			{/* Title Section */}
			<BannerTitle title={menuTitle} imageLink={bannerImageUrl}></BannerTitle>

			<div className='my-profile-containers' style={{ display: locationPath !== '/messaging' ? 'flex' : 'none' }}>
				{/* Conditionally render hamburger modal */}

				<div className='submenu-container'>
					{/* START CONDITIONAL BACK BUTTON */}
					<div
						className='back-container'
						style={{ display: gameProfilePaths.includes(locationPath) ? 'flex' : 'none' }}
					>
						<button
							className='back-button'
							onClick={() => {
								navigate('/general-profile');
							}}
						>
							&nbsp; back to general profile
						</button>
					</div>
					{/* END CONDITIONAL BACK BUTTON */}
					{/* START Profile Widgets */}
					<ProfileWidgetsContainer></ProfileWidgetsContainer>
					<div className='gradient-bar'></div>
					{/* END Profile Widgets */}
					{/* Game Profiles (Conditional) */}
					{locationPath === '/rust-profile' ? (
						<ProfileRust locationPath={locationPath} changeBanner={changeBannerImage}></ProfileRust>
					) : (
						<> </>
					)}
					{locationPath === '/rocket-league-profile' ? (
						<ProfileRocketLeague locationPath={locationPath} changeBanner={changeBannerImage}></ProfileRocketLeague>
					) : (
						<> </>
					)}
					{locationPath === '/general-profile' ? (
						<ProfileGeneral changeBanner={changeBannerImage}></ProfileGeneral>
					) : (
						<> </>
					)}
					{locationPath === '/account-settings' ? (
						<AccountSettings changeBanner={changeBannerImage}></AccountSettings>
					) : (
						<> </>
					)}
					{/* MENU 1- My Prof */}
				</div>
			</div>

			{/* MENU 2- Connections || Messaging */}
			{locationPath === '/messaging' ? (
				<div className='messaging-container'>
					<div className='chat-container'>
						<div className='conversations-box'>
							<ConversationTile
								key={0.1}
								{...rustChatObject}
								currentlyOpenConvo={currentConvo}
								callOpenConversation={(connectionId: number) => {
									openConversation(connectionId);
								}}
							></ConversationTile>
							<ConversationTile
								key={0.2}
								{...minecraftChatObject}
								currentlyOpenConvo={currentConvo}
								callOpenConversation={(connectionId: number) => {
									openConversation(connectionId);
								}}
							></ConversationTile>
							<ConversationTile
								key={0.3}
								{...rocketLeagueChatObject}
								currentlyOpenConvo={currentConvo}
								callOpenConversation={(connectionId: number) => {
									openConversation(connectionId);
								}}
							></ConversationTile>
							<div key={0.75} className='gradient-bar'></div>
							{connectionsResult.map((tile: any) => (
								<li className='conversation-list-item' style={{ listStyleType: 'none' }} key={tile.id}>
									<ConversationTile
										key={tile.id}
										{...tile}
										currentlyOpenConvo={currentConvo}
										isPublicChat='false'
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
			{locationPath === '/incoming-requests' ? (
				<div className='content-container'>{incomingResult.length > 0 ? incomingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 4- Outgoing Connections */}
			{locationPath === '/outgoing-requests' ? (
				<div className='content-container'>{outgoingResult.length > 0 ? outgoingResult : noResultsDiv}</div>
			) : (
				<></>
			)}
			{/* MENU 5- Blocked People */}
			{locationPath === '/blocked' ? (
				<div className='content-container'>{blockedResult.length > 0 ? blockedResult : noResultsDiv}</div>
			) : (
				<></>
			)}
		</div>
	);
}
