import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import '../../styling/modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logoutUser } from '../../store/userSlice';

type Props = {
	toggleHamburger: any;
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
	}, []);

	const handleMouseEnter = () => {
		setExitIcon('/assets/exit-icon-hover.png');
	};

	const handleMouseLeave = () => {
		setExitIcon('/assets/exit-icon.png');
	};

	const logoutFunction = () => {
		dispatch(logoutUser(userState.id));
		navigate('/login');
	};

	const navigationButtonPressed = (link: string) => {
		// Closes the side menu
		props.toggleHamburger();
		// Navigates to dynamic url (new page)
		navigate(`/${link}`);
	};

	return (
		<div className="hamburger-red-panel">
			<div className="hamburger-green-panel">
				<div className="hamburger-nav">
					<img
						onClick={props.toggleHamburger}
						className="hamburger-exit"
						src={exitIcon}
						onMouseOver={handleMouseEnter}
						onMouseOut={handleMouseLeave}
						alt="exit Icon"
					/>
					<div
						onClick={() => {
							navigationButtonPressed('lounge');
						}}
						className="hamburger-links"
					>
						<button className="hamburger-button">lounge</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('classifieds');
						}}
						className="hamburger-links"
					>
						<button className="hamburger-button">classifieds</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('profile');
						}}
						className="hamburger-links"
					>
						<button className="hamburger-button">profile</button>
					</div>
					<div
						onClick={() => {
							navigationButtonPressed('about');
						}}
						className="hamburger-links"
					>
						<button className="hamburger-button">about</button>
					</div>
					<div onClick={() => logoutFunction()} className="hamburger-links">
						<button className="hamburger-exit-button">logout</button>
					</div>
					<h5>codeexchange</h5>
				</div>
			</div>
		</div>
	);
};

export default DrawerComponent;
