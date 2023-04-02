import { useEffect, useRef, useState } from 'react';
import './profileInlayComponent.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import Backdrop from '../modal/backdropComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Menu } from 'primereact/menu';
import * as io from 'socket.io-client';
import { howLongAgo } from '../../utils/helperFunctions';
import { getNotificationsUser } from '../../utils/rest';
import ReactTooltip from 'react-tooltip';
const socketRef = io.connect(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.gangs.gg');

export default function ProfileInlayComponet() {
	const locationPath: string = useLocation().pathname;
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user.user);
	const [drawerVis, setDrawerVis] = useState<boolean>(false);
	const [profileImage, setProfileImage] = useState<string>('');
	const [notifications, setnotifications] = useState<any>([]);

	const notifsMenu: any = useRef(null);
	const discoverMenu: any = useRef(null);
	useEffect(() => {
		if (typeof userState.avatar_url === 'string' && userState.avatar_url.length > 1) {
			setProfileImage('userState.avatar_url');
		}
		if (userState.id && userState.id > 0) {
			loadNotificationHistory();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//BEGIN Update notifications list after each notification sent
	useEffect(() => {
		socketRef.on('notification', ({ owner_id, type_id, other_user_id, other_user_avatar_url, other_username }: any) => {
			setnotifications([{ owner_id, type_id, other_user_id, other_user_avatar_url, other_username }, ...notifications]);
			renderNotifications();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notifications]);
	//END Update notifications list after each notification sent

	useEffect(() => {
		setProfileImage(userState.avatar_url);
	}, [userState.avatar_url]);

	//BEGIN SOCKET Functions
	const loadNotificationHistory = async () => {
		const historicalNotifications = await getNotificationsUser(userState.id, '');
		setnotifications([...historicalNotifications]);
		if (userState.id && userState.id > 0) {
			socketRef.emit('join_room', `notifications-${userState.id}`);
		}
	};
	const renderDiscoverOptions = () => {
		return [
			{
				label: (
					<img
						onClick={() => {
							navigate(`/lfg-rust`);
						}}
						className='discover-navigator-option-image'
						src={'https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png'}
						alt={`link to rust lfg page`}
					/>
				),
			},
			{
				label: (
					<img
						onClick={() => {
							navigate(`/lfg-rocket-league`);
						}}
						className='discover-navigator-option-image'
						src={'https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png'}
						alt={`link to rocket league lfg page`}
					/>
				),
			},
		] as any;
	};
	const renderNotifications = () => {
		if (notifications.length) {
			let items: any = [];
			const actionPhrases: any = {
				1: ' sent you a connection request',
				2: ' accepted your connection request',
				3: ' sent you a message',
				4: ' congrats on signing up!',
			};

			notifications.forEach((notif: any) => {
				items.push({
					label: (
						<div
							className='notification-container'
							onClick={() => {
								notificationPressed(notif.type_id);
							}}
						>
							{notif.other_user_avatar_url === '' ||
							notif.other_user_avatar_url === '/assets/avatarIcon.png' ||
							notif.other_user_avatar_url === null ? (
								<div className='dynamic-avatar-border'>
									<div className='dynamic-avatar-text-small'>
										{notif.other_username === null
											? 'gg'
											: notif.other_username
													.split(' ')
													.map((word: string[]) => word[0])
													.join('')
													.slice(0, 2)}
									</div>
								</div>
							) : (
								<img
									className='notification-profile-image'
									src={notif.other_user_avatar_url}
									alt={`${notif.other_username}'s avatar`}
								/>
							)}
							<div className='notification-username'> {notif.other_username}</div>
							{actionPhrases[notif.type_id]}
							<div className='notification-timestamp'>{howLongAgo(notif.created_at)}</div>
						</div>
					),
				});
			});
			return items;
		} else {
			return [
				{
					label: (
						<div className='notification-container' onClick={() => {}}>
							no notifications yet!
						</div>
					),
				},
			];
		}
	};
	//END SOCKET Functions

	const notificationPressed = (notificationType: number) => {
		let newUrl = '/general-profile';
		//Decide between sub-sections of a url
		if (notificationType === 1) {
			newUrl = '/incoming-requests';
		} else if (notificationType === 2 || notificationType === 3) {
			newUrl = '/messaging';
		} else if (notificationType === 4) {
			newUrl = `/general-profile`;
		} else if (notificationType === 99) {
			newUrl = `/dashboard`;
		}

		// Navigates to dynamic url (new page)
		navigate(`${newUrl}`);
	};

	const toggleDrawer = () => {
		setDrawerVis(!drawerVis);
	};

	return (
		<div className='my-profile-overlay'>
			{/* Conditionally render hamburger modal */}
			{drawerVis ? <Backdrop toggleDrawer={toggleDrawer} /> : <></>}
			{/* Conditionally render log in options or show profile info */}
			{userState.email === '' ? (
				<div className='my-profile-overlay-link prof-overlay-text' onClick={() => navigate('/login')}>
					Log In | Sign Up
				</div>
			) : (
				<div className='my-profile-overlay-wrapper'>
					<Menu model={renderNotifications()} popup ref={notifsMenu} id='popup_menu' />
					<Menu model={renderDiscoverOptions()} popup ref={discoverMenu} id='popup_menu' />
					{locationPath === '/lfg-rust' || locationPath === '/lfg-rocket-league' ? (
						<img
							onClick={(event) => discoverMenu.current.toggle(event)}
							className='discover-navigator-image'
							src={
								locationPath === '/lfg-rust'
									? 'https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png'
									: 'https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png'
							}
							alt={`lfg page navigator`}
							data-tip
							data-for='platformTip'
						/>
					) : (
						<></>
					)}
					<button
						className='text-only-button notifications-button'
						onClick={(event) => notifsMenu.current.toggle(event)}
					>
						<i className='pi pi-bell' />
					</button>
					<button 
						className='text-only-button notifications-button' 
						onClick={(event) => notificationPressed(99)} 
						data-tip
						data-for='dashboardTip'
					>
						<i className='pi pi-users' />
					</button>
					<button 
						className='text-only-button notifications-button' 
						onClick={(event) => notificationPressed(3)} 
						data-tip
						data-for='messagingTip'
					>
						<i className='pi pi-envelope' />
					</button>
					<div className='my-profile-overlay-link'>
						{profileImage === '' || profileImage === '/assets/avatarIcon.png' ? (
							<div className='dynamic-avatar-border' onClick={toggleDrawer}>
								<div className='dynamic-avatar-text-small'>
									{userState.username
										? userState.username
												.split(' ')
												.map((word: string[]) => word[0])
												.join('')
												.slice(0, 2)
										: 'gg'}
								</div>
							</div>
						) : (
							<img className='nav-overlay-img' onClick={toggleDrawer} src={profileImage} alt='my avatar' />
						)}
					</div>
				</div>
			)}
			<ReactTooltip id='platformTip' place='left' effect='solid'>
				select game for player discovery
			</ReactTooltip>
			<ReactTooltip id='dashboardTip' place='bottom' effect='solid'>
				my dashboard
			</ReactTooltip>
			<ReactTooltip id='messagingTip' place='bottom' effect='solid'>
				messaging
			</ReactTooltip>
		</div>
	);
}
