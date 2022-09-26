import { useEffect, useRef, useState } from 'react';
import './profileInlayComponent.scss';
import { useNavigate } from 'react-router-dom';
import Backdrop from '../modal/backdropComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setPreferences } from '../../store/userPreferencesSlice';
import { Menu } from 'primereact/menu';
import * as io from 'socket.io-client';
import { howLongAgo } from '../../utils/helperFunctions';
import { getNotificationsUser } from '../../utils/rest';
const socketRef = io.connect(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.gangs.gg');

export default function ProfileInlayComponet() {
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user.user);
	const preferencesState = useSelector((state: RootState) => state.preferences);
	const [drawerVis, setDrawerVis] = useState<boolean>(false);
	const [profileImage, setProfileImage] = useState<string>('');
	const [notifications, setnotifications] = useState<any>([]);
	const [navItems, setnavItems] = useState<any>([]);

	const dispatch = useDispatch();

	const notifsMenu: any = useRef(null);
	useEffect(() => {
		if (typeof userState.avatar_url === 'string' && userState.avatar_url.length > 1) {
			setProfileImage('userState.avatar_url');
		}
		if (userState.id && userState.id > 0) {
			loadNotificationHistory();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//BEGIN Update notifications list after each chat sent
	useEffect(() => {
		socketRef.on('notification', ({ owner_id, type_id, other_user_id, other_user_avatar_url, other_username }: any) => {
			setnotifications([{ owner_id, type_id, other_user_id, other_user_avatar_url, other_username }, ...notifications]);
			renderNotifications();
		});
	}, [notifications]);
	//END Update notifications list after each chat sent

	useEffect(() => {
		setProfileImage(userState.avatar_url);
	}, [userState.avatar_url]);

	//BEGIN SOCKET Functions
	const loadNotificationHistory = async () => {
		const historicalNotifications = await getNotificationsUser(userState.id, '');
		setnotifications([...historicalNotifications]);
		socketRef.emit('join_room', `notifications-${userState.id}`);
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
						<div className="notification-container">
							{notif.other_user_avatar_url === '' ||
							notif.other_user_avatar_url === '/assets/avatarIcon.png' ||
							notif.other_user_avatar_url === null ? (
								<div className="dynamic-avatar-border">
									<div className="dynamic-avatar-text-small">
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
									className="notification-profile-image"
									src={notif.other_user_avatar_url}
									alt={`${notif.other_username}'s avatar`}
								/>
							)}
							<div className="notification-username"> {notif.other_username}</div>
							{actionPhrases[notif.type_id]}
							<div className="notification-timestamp">{howLongAgo(notif.created_at)}</div>
						</div>
					),
				});
			});
			return items;
		}
	};
	//END SOCKET Functions

	const notificationPressed = (destination: string) => {
		//Decide between sub-sections of a url
		let link = destination;
		if (destination === 'connections') {
			link = 'profile';
			dispatch(
				setPreferences({
					...preferencesState,
					lastProfileMenu: 2,
				})
			);
		} else if (destination === 'myProfile') {
			link = 'profile';
			dispatch(
				setPreferences({
					...preferencesState,
					lastProfileMenu: 1,
				})
			);
		}
		// Navigates to dynamic url (new page)
		navigate(`/${link}`);
	};

	const toggleDrawer = () => {
		setDrawerVis(!drawerVis);
	};

	return (
		<div className="my-profile-overlay">
			{/* Conditionally render hamburger modal */}
			{drawerVis ? <Backdrop toggleDrawer={toggleDrawer} /> : <></>}
			{/* Conditionally render log in options or show profile info */}
			{userState.email === '' ? (
				<div className="my-profile-overlay-link prof-overlay-text" onClick={() => navigate('/login')}>
					Log In | Sign Up
				</div>
			) : (
				<div className="my-profile-overlay-wrapper">
					{/* <i onClick={() => navigate("/messages")} className="pi pi-comments " /> */}
					<Menu model={renderNotifications()} popup ref={notifsMenu} id="popup_menu" />
					<button
						className="text-only-button notifications-button"
						onClick={(event) => notifsMenu.current.toggle(event)}
					>
						<i className="pi pi-bell" />
					</button>
					<div className="my-profile-overlay-link">
						<div className="prof-overlay-text" onClick={toggleDrawer}>
							{userState.username}
						</div>

						{profileImage === '' || profileImage === '/assets/avatarIcon.png' ? (
							<div className="dynamic-avatar-border" onClick={toggleDrawer}>
								<div className="dynamic-avatar-text-small">
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
							<img className="nav-overlay-img" onClick={toggleDrawer} src={profileImage} alt="avatar Icon" />
						)}
					</div>
				</div>
			)}
		</div>
	);
}
