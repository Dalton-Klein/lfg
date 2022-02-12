import { useEffect, useState } from 'react';
import '../../styling/profileInlay.scss';
import { useNavigate } from 'react-router-dom';
import Backdrop from '../modal/backdropComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function ProfileInlayComponet() {
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user.user);
	const [hamburgVis, setHamburgVis] = useState<boolean>(false);
	let profileImage = '/assets/avatarIcon.png';

	useEffect(() => {
		if (typeof userState.avatarUrl === 'string' && userState.avatarUrl.length > 1) {
			profileImage = userState.avatarUrl;
		}
	}, []);

	const toggleHamburger = () => {
		setHamburgVis(!hamburgVis);
	};

	if (hamburgVis) return <Backdrop toggleHamburger={toggleHamburger} />;

	return (
		<div className="my-profile-overlay">
			{userState.email === '' ? (
				<div
					className="my-profile-overlay-link prof-overlay-text"
					onClick={() => navigate('/login')}
				>
					Log In | Sign Up
				</div>
			) : (
				<div className="my-profile-overlay-wrapper">
					<img
						onClick={() => navigate('/#/messages')}
						className="nav-overlay-img"
						src={'/assets/ChatIcon.png'}
						alt="Chat Icon"
					/>
					<div className="my-profile-overlay-link">
						<div className="prof-overlay-text" onClick={toggleHamburger}>
							{userState.username}
						</div>

						<img
							className="nav-overlay-img"
							onClick={toggleHamburger}
							src={profileImage}
							alt="avatar Icon"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
