import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './drawerComponent.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logoutUser } from '../../store/userSlice';
import { GoogleLogout } from 'react-google-login';
const clientId = '244798002147-mm449tgevgljdthcaoirnlmesa8dkapb.apps.googleusercontent.com';

type Props = {
	toggleDrawer: any;
	handleMouseEnter?: any;
	handleMouseLeave?: any;
};

const DrawerComponent = (props: Props) => {
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user.user);
	const dispatch = useDispatch();
	const [exitIcon, setExitIcon] = useState<string>('/assets/exit-icon.png');

	useEffect(() => {
		gsap.from('.hamburger-red-panel', 0.25, {
			x: 400,
		});
		gsap.to('.hamburger-red-panel', 0.25, {
			opacity: 1,
		});
		gsap.from('.hamburger-green-panel', 0.25, {
			x: 400,
			delay: 0.15,
		});
		gsap.to('.hamburger-green-panel', 0.25, {
			opacity: 1,
			delay: 0.15,
		});
		gsap.from('.hamburger-nav', 0.25, {
			x: 400,
			delay: 0.25,
		});
		gsap.to('.hamburger-nav', 0.25, {
			opacity: 1,
			delay: 0.25,
		});
		handleMouseLeave();
		return () => {
			setExitIcon('/assets/exit-icon.png');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleMouseEnter = () => {
		setExitIcon('/assets/exit-icon-hover2.png');
	};

	const handleMouseLeave = () => {
		setExitIcon('/assets/exit-icon.png');
	};

	const logoutFunction = () => {
		dispatch(logoutUser(userState.id));
		navigate('/login');
	};

	const navigationButtonPressed = (destination: string) => {
		// Closes the side menu
		props.toggleDrawer();
		//Decide between sub-sections of a url
		let link = destination;
		//***Fix this so that the destination is just the url
		if (destination === 'genProfile') {
			link = 'general-profile';
		} else if (destination === 'messaging') {
			link = 'messaging';
		} else if (destination === 'incoming') {
			link = 'incoming-requests';
		} else if (destination === 'outgoing') {
			link = 'outgoing-requests';
		} else if (destination === 'accountSettings') {
			link = 'account-settings';
		} else if (destination === 'help') {
			link = 'help';
		}
		// Navigates to dynamic url (new page)
		navigate(`/${link}`);
	};

	return (
		<div className='hamburger-red-panel'>
			<div className='hamburger-green-panel'>
				<div className='hamburger-nav'>
					<img
						onClick={props.toggleDrawer}
						className='hamburger-exit'
						src={exitIcon}
						onMouseOver={handleMouseEnter}
						onMouseOut={handleMouseLeave}
						alt='exit'
					/>
					<div
						onClick={() => {
							navigationButtonPressed('lfg');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>lfg</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('messaging');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>messaging</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('genProfile');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>general profile</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('accountSettings');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>account settings</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('incoming');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>incoming requests</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('outgoing');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>outgoing requests</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('blog');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>blog</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('help');
						}}
						className='hamburger-links'
					>
						<button className='hamburger-button'>help | faq</button>
					</div>
					<div className='hamburger-links'>
						<GoogleLogout
							className='google-button'
							clientId={clientId}
							buttonText='logout'
							onLogoutSuccess={logoutFunction}
							onFailure={logoutFunction}
						/>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('privacy-policy');
						}}
						className='hamburger-links'
					>
						<button className='text-only-button boring-button'>privacy policy</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('terms-of-service');
						}}
						className='hamburger-links'
					>
						<button className='text-only-button boring-button'>terms of service</button>
					</div>
					<img className='small-logo' src='/assets/logo-v2-gangs.gg-transparent-white.png' alt='gangs-logo-small' />
					<h5>gangs</h5>
				</div>
			</div>
		</div>
	);
};

export default DrawerComponent;
