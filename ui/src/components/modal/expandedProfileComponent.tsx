import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import './expandedProfileComponent.scss';
import { getProfileSocialData, createConnectionRequest } from '../../utils/rest';
import { howLongAgo } from '../../utils/helperFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

type Props = {
	toggleExpandedProfile: any;
	userInfo: any;
	refreshTiles: any;
	showConnectForm: boolean;
};

const ExpandedProfile = (props: Props) => {
	const [exitIcon, setExitIcon] = useState<string>('/assets/exit-icon.png');
	const [connectionText, setConnectionText] = useState<string>('');
	const [requestSent, setRequestSent] = useState<boolean>(false);
	const [socialData, setSocialData] = useState<any>({ connections: 0, mutual: 0 });
	const lastSeen = howLongAgo(props.userInfo.last_seen);
	const userState = useSelector((state: RootState) => state.user.user);

	let hasSendError = false;

	useEffect(() => {
		fetchSocialData();
		document.querySelector('.backdrop-event-listener')!.addEventListener('click', () => {
			props.toggleExpandedProfile();
		});
		gsap.from('.hamburger-primary-panel', 0.25, {
			x: 400,
		});
		gsap.to('.hamburger-primary-panel', 0.25, {
			opacity: 1,
		});
		gsap.from('.hamburger-secondary-panel', 0.25, {
			x: 400,
			delay: 0.15,
		});
		gsap.to('.hamburger-secondary-panel', 0.25, {
			opacity: 1,
			delay: 0.15,
		});
		gsap.from('.profile-container', 0.25, {
			x: 400,
			delay: 0.25,
		});
		gsap.to('.profile-container', 0.25, {
			opacity: 1,
			delay: 0.25,
		});
		handleMouseLeave();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchSocialData = async () => {
		const socialData = await getProfileSocialData(userState.id, props.userInfo.id, 'nothing');
		console.log('social data: , ', socialData);
		setSocialData(socialData);
	};

	const handleMouseEnter = () => {
		setExitIcon('/assets/exit-icon-hover2.png');
	};

	const handleMouseLeave = () => {
		setExitIcon('/assets/exit-icon.png');
	};

	const sendConnectionRequest = async () => {
		const requestResult = await createConnectionRequest(userState.id, props.userInfo.id, 1, connectionText, 'nothing');
		if (requestResult.status === 'success') {
			setRequestSent(true);
			props.refreshTiles();
		} else {
			hasSendError = true;
		}
	};
	return createPortal(
		<div className="backdrop-container">
			<div className="backdrop-event-listener"></div>
			<div className="hamburger-primary-panel">
				<div className="hamburger-secondary-panel">
					<div className="profile-container">
						<img
							onClick={props.toggleExpandedProfile}
							className="hamburger-exit"
							src={exitIcon}
							onMouseOver={handleMouseEnter}
							onMouseOut={handleMouseLeave}
							alt="exit Icon"
						/>
						<div className="expanded-banner">
							<img className="expanded-photo" onClick={() => {}} src={props.userInfo.avatar_url} alt="avatar" />
							<div className="expanded-basic-info">
								<div className="expanded-username">{props.userInfo.username}</div>
								<div className="expanded-basic-text">{lastSeen}</div>
								<div className="expanded-basic-text">{props.userInfo.about}</div>
							</div>
						</div>
						<div className="expanded-gradient-bar"></div>
						{/* Core Info Section */}
						<div className="expanded-core-info">
							<div className="expanded-core-info-field">
								<label>language</label>
								<div>{props.userInfo.languages}</div>
							</div>
							<div className="expanded-core-info-field">
								<label>age</label>
								<div>{props.userInfo.age}</div>
							</div>
							<div className="expanded-core-info-field">
								<label>gender</label>
								<div>{props.userInfo.gender}</div>
							</div>
							<div className="expanded-core-info-field">
								<label>region</label>
								<div>
									{props.userInfo.region_abbreviation ? props.userInfo.region_abbreviation : props.userInfo.region}
								</div>
							</div>
						</div>
						<div className="expanded-gradient-bar"></div>
						{/* Game Info Section */}
						<div className="expanded-core-info">
							<div className="expanded-core-info-field">
								<label>hours</label>
								<div>{props.userInfo.hours}</div>
							</div>
							<div className="expanded-core-info-field">
								<label>weekdays</label>
								<div>{props.userInfo.weekdays}</div>
							</div>
							<div className="expanded-core-info-field">
								<label>weekends</label>
								<div>{props.userInfo.weekends}</div>
							</div>
						</div>
						<div className="expanded-gradient-bar"></div>
						{/* Social Section */}
						<div className="expanded-social-container">
							{props.userInfo.preferred_platform === 1 ? (
								<img
									className="expanded-platform-image"
									src="/assets/discord-logo-small.png"
									alt={`${props.userInfo.username} discord`}
								/>
							) : (
								<></>
							)}
							{props.userInfo.preferred_platform === 2 ? (
								<img
									className="expanded-platform-image"
									src="/assets/psn-logo-small.png"
									alt={`${props.userInfo.username} psn`}
								/>
							) : (
								<></>
							)}
							{props.userInfo.preferred_platform === 3 ? (
								<img
									className="expanded-platform-image"
									src="/assets/xbox-logo-small.png"
									alt={`${props.userInfo.username} xbox`}
								/>
							) : (
								<></>
							)}
							<div className="expanded-social-box">
								<div>connections</div>
								<div>{socialData.connections}</div>
							</div>
							<div className="expanded-social-box">
								<div>mutual</div>
								<div>{socialData.mutual}</div>
							</div>
						</div>
						<div className="expanded-gradient-bar"></div>
						{/* Connect Section */}
						{props.showConnectForm ? (
							<div className="expanded-connect-box">
								<input
									onChange={(event) => {
										setConnectionText(event.target.value);
									}}
									value={connectionText ? connectionText : ''}
									className="input-box"
									placeholder={'write a message with your request'}
								></input>
								<button
									className="connect-button"
									onClick={() => {
										sendConnectionRequest();
									}}
									disabled={connectionText === '' || requestSent || hasSendError}
								>
									<i className="pi pi-users" />
									&nbsp; {requestSent ? 'pending' : 'send request'}
								</button>
								{hasSendError ? (
									<small id="username-help" className="p-error">
										problem sending request
									</small>
								) : (
									<></>
								)}
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</div>,
		document.getElementById('drawer-hook')!
	);
};

export default ExpandedProfile;
