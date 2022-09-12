import React, { useEffect, useRef, useState } from 'react';
import './connectionTile.scss';
import { useNavigate } from 'react-router-dom';
import ExpandedProfile from '../modal/expandedProfileComponent';
import { Menu } from 'primereact/menu';

export default function ConnectionTile(props: any) {
	const [platformUsername, setPlatformUsername] = useState<any>('');
	const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);

	const menu: any = useRef(null);

	useEffect(() => {
		console.log('props? ', props);
		if (props.preferred_platform === 1) setPlatformUsername(props.discord);
		else if (props.preferred_platform === 2) setPlatformUsername(props.psn);
		else if (props.preferred_platform === 3) setPlatformUsername(props.xbox);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const navigate = useNavigate();

	const items = [
		{
			items: [
				{
					label: 'block',
					icon: 'pi pi-user-minus',
					command: () => {},
				},
				{
					label: 'report',
					icon: 'pi pi-flag',
					command: () => {},
				},
			],
		},
	];

	const toggleExpandedProfile = () => {
		setExpandedProfileVis(!expandedProfileVis);
	};

	return (
		<div className="connection-container">
			{/* Conditionally render hamburger modal */}
			{expandedProfileVis ? (
				<ExpandedProfile
					toggleExpandedProfile={toggleExpandedProfile}
					userInfo={props}
					refreshTiles={props.refreshTiles}
					showConnectForm={false}
				/>
			) : (
				<></>
			)}
			{/* User Connection Info Section */}
			<div className="connection-user-box">
				<img
					onClick={() => {
						console.log('Link to profile view here later!');
					}}
					className="connection-profile-image"
					src={props.avatar_url}
					alt={`${props.username} profile`}
				/>
				<div className="connection-name">{props.username}</div>
				<img className="connection-game-image" src="/assets/rust-logo-small.png" alt={`${props.username} profile`} />
			</div>
			{/* If full connection, show platform/social section */}
			{props.type === 2 ? (
				<div className="connection-chat-platform-container">
					<div className={`connection-chat-platform-box ${props.preferred_platform === 1 ? 'box-selected' : ''}`}>
						<img
							className="connection-platform-image"
							src="/assets/discord-logo-small.png"
							alt={`${props.username} profile`}
						/>
					</div>
					<div className={`connection-chat-platform-box ${props.preferred_platform === 2 ? 'box-selected' : ''}`}>
						<img
							className="connection-platform-image"
							src="/assets/psn-logo-small.png"
							alt={`${props.username} profile`}
						/>
					</div>
					<div className={`connection-chat-platform-box ${props.preferred_platform === 3 ? 'box-selected' : ''}`}>
						<img
							className="connection-platform-image"
							src={props.platform === 1 ? '/assets/xbox-logo-small.png' : ''}
							alt={`${props.username} profile`}
						/>
					</div>
					<div className="connection-chat-platform-text">{platformUsername}</div>
				</div>
			) : (
				<></>
			)}
			{/* If incoming connection, show accept buttton */}
			{props.type === 3 ? (
				<button
					className="accept-button"
					onClick={() => {
						acceptRequest();
					}}
				>
					<i className="pi pi-user-plus" />
					&nbsp; accept
				</button>
			) : (
				<></>
			)}
			{/* View Profile Button */}
			{props.type !== 5 ? (
				<button
					className="connect-button"
					onClick={() => {
						toggleExpandedProfile();
					}}
				>
					<i className="pi pi-plus" />
					&nbsp; view
				</button>
			) : (
				<></>
			)}
			<Menu model={items} popup ref={menu} id="popup_menu" />
			<button className="text-only-button" onClick={(event) => menu.current.toggle(event)}>
				<i className="pi pi-ellipsis-h"></i>
			</button>
		</div>
	);
}
