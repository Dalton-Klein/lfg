import { useEffect, useRef, useState } from 'react';
import './profileInlayComponent.scss';
import { useNavigate } from 'react-router-dom';
import Backdrop from '../modal/backdropComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Menu } from 'primereact/menu';

export default function ProfileInlayComponet() {
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user.user);
	const [drawerVis, setDrawerVis] = useState<boolean>(false);
	const [profileImage, setProfileImage] = useState<string>('');

	const notifsMenu: any = useRef(null);
	const navItems = [
		{
			label: 'notifications coming soon!',
		},
	];
	useEffect(() => {
		if (typeof userState.avatar_url === 'string' && userState.avatar_url.length > 1) {
			setProfileImage('userState.avatar_url');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setProfileImage(userState.avatar_url);
	}, [userState.avatar_url]);

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
					<Menu model={navItems} popup ref={notifsMenu} id="popup_menu" />
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
