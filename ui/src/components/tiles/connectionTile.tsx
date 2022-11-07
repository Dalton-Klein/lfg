import React, { useEffect, useRef, useState } from 'react';
import './connectionTile.scss';
import ExpandedProfile from '../modal/expandedProfileComponent';
import { Menu } from 'primereact/menu';

export default function ConnectionTile(props: any) {
  console.log('propsL ', props);
  const [platformUsername, setPlatformUsername] = useState<any>('');
  const [platformImgLink, setplatformImgLink] = useState<string>('');
	const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);

	const menu: any = useRef(null);

	useEffect(() => {
    switch (props.platform) {
      case 1:
        setplatformImgLink('https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png')
        break;
      case 2:
        setplatformImgLink('https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png')
        break;
      default:
        break;
    }
		if (props.preferred_platform === 1) setPlatformUsername(props.discord);
		else if (props.preferred_platform === 2) setPlatformUsername(props.psn);
		else if (props.preferred_platform === 3) setPlatformUsername(props.xbox);
		return () => {
			setPlatformUsername('');
			setExpandedProfileVis(false);
    };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const items = [
		{
			items: [
				{
					label: 'block',
					icon: 'pi pi-user-minus',
					command: () => {},
				},
			],
		},
	];

	const toggleExpandedProfile = () => {
		setExpandedProfileVis(!expandedProfileVis);
	};

	return (
		<div className='connection-tile'>
			<div className='connection-main-container'>
				{/* Conditionally render hamburger modal */}
				{expandedProfileVis ? (
					<ExpandedProfile
						toggleExpandedProfile={toggleExpandedProfile}
						userInfo={props}
						refreshTiles={props.refreshTiles}
						showConnectForm={false}
						isProfileComplete={true}
						isConnected={false}
						game={'all'}
					/>
				) : (
					<></>
				)}
				{/* User Connection Info Section */}
				<div className='connection-user-box'>
					{props.avatar_url === '' || props.avatar_url === '/assets/avatarIcon.png' ? (
						<div
							className='dynamic-avatar-border'
							onClick={() => {
								toggleExpandedProfile();
							}}
						>
							<div className='dynamic-avatar-text-small'>
								{props.username
									.split(' ')
									.map((word: string[]) => word[0])
									.join('')
									.slice(0, 2)}
							</div>
						</div>
					) : (
						<img
							onClick={() => {
								toggleExpandedProfile();
							}}
							className='connection-profile-image'
							src={props.avatar_url}
							alt={`${props.username}'s profile`}
						/>
					)}
				</div>
				<div className='stackable-container'>
					<div className='stackable-container-left'>
						<div className='connection-name'>{props.username}</div>
						<img
							className='connection-game-image'
							src={platformImgLink}
							alt={`${props.username} profile`}
						/>
					</div>
					{/* If full connection, show platform/social section */}
					{props.type === 2 ? (
						<div className='stackable-container-right'>
							<div className={`connection-chat-platform-box ${props.preferred_platform === 1 ? 'box-selected' : ''}`}>
								<img
									className='connection-platform-image'
									src='/assets/discord-logo-small.png'
									alt={`${props.username} profile`}
								/>
							</div>
							<div className={`connection-chat-platform-box ${props.preferred_platform === 2 ? 'box-selected' : ''}`}>
								<img
									className='connection-platform-image'
									src='/assets/psn-logo-small.png'
									alt={`${props.username} profile`}
								/>
							</div>
							<div className={`connection-chat-platform-box ${props.preferred_platform === 3 ? 'box-selected' : ''}`}>
								<img
									className='connection-platform-image'
									src={props.platform === 1 ? '/assets/xbox-logo-small.png' : ''}
									alt={`${props.username} profile`}
								/>
							</div>
							<div className='connection-chat-platform-text'>{platformUsername}</div>
						</div>
					) : (
						<></>
					)}
					{/* If incoming connection, show accept buttton */}
					{props.type === 3 ? (
						<button
							className='accept-button'
							onClick={() => {
								props.callAcceptRequest(props.user_id, props.requestid);
							}}
						>
							<i className='pi pi-user-plus' />
							&nbsp; accept
						</button>
					) : (
						<></>
					)}
				</div>
				<Menu model={items} popup ref={menu} id='popup_menu' />
				<button className='text-only-button' onClick={(event) => menu.current.toggle(event)}>
					<i className='pi pi-ellipsis-h'></i>
				</button>
			</div>
			{props.message ? (
				<div className='incoming-message'>
					<div className='incoming-message-title'>{props.username}:</div>
					<div className='incoming-message-content'>{props.message}</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
