import './playerTile.scss';
import 'primeicons/primeicons.css';
import { howLongAgo } from '../../utils/helperFunctions';
import { useState } from 'react';
import ExpandedProfile from '../modal/expandedProfileComponent';

export default function PlayerTile(props: any) {
	const genderImageLinks: any = {
		1: 'male',
		2: 'female',
		3: 'non-binary',
	};
	const lastSeen = howLongAgo(props.last_seen);
	const genderIcon = `/assets/gender-icon-${genderImageLinks[props.gender]}.png`;

	const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);

	const toggleExpandedProfile = () => {
		setExpandedProfileVis(!expandedProfileVis);
	};

	return (
		<div>
			{/* Conditionally render hamburger modal */}
			{expandedProfileVis ? (
				<ExpandedProfile
					toggleExpandedProfile={toggleExpandedProfile}
					userInfo={props}
					refreshTiles={props.refreshTiles}
					showConnectForm={true}
					isProfileComplete={props.isProfileComplete}
				/>
			) : (
				<></>
			)}
			<div className="player-card">
				{/* main details */}
				<div className="main-details">
					<div className="image-column">
						{props.avatar_url === '' || props.avatar_url === '/assets/avatarIcon.png' ? (
							<div
								className="dynamic-avatar-border"
								onClick={() => {
									toggleExpandedProfile();
								}}
							>
								<div className="dynamic-avatar-text-med">
									{props.username
										.split(' ')
										.map((word: string[]) => word[0])
										.join('')
										.slice(0, 2)}
								</div>
							</div>
						) : (
							<img className="card-photo" onClick={() => {}} src={props.avatar_url} alt="avatar" />
						)}
					</div>
					<div className="info-column">
						<div className="info-title-row">
							<div>{props.username}</div>
							<button
								className="connect-button"
								onClick={() => {
									toggleExpandedProfile();
								}}
							>
								<i className="pi pi-plus" />
								&nbsp; view
							</button>
						</div>
						<div className="info-stats-row">
							<div className="info-stats-attribute">{props.languages}</div>
							<div className="info-stats-attribute">{props.age}</div>
							<img className="gender-icon" src={genderIcon} alt="gender"></img>
							<div className="info-stats-attribute">{props.region_abbreviation}</div>
						</div>
					</div>
				</div>
				{/* lesser details */}
				<div className="lesser-details">
					<div className="details-about">
						<div className="details-about-text">{props.about}</div>
					</div>
					<div className="details-hours-played">
						<div className="hours-belt-outer">
							<div className="hours-belt-inner">
								<div className="details-hours-played-text">{props.hours} hours</div>
							</div>
						</div>
					</div>
					<div className="details-availability">
						<div className="detail-label">weekdays: </div>
						<div className="details-availabilty-text">{props.weekdays}</div>
						<div className="detail-label">weekdends: </div>
						<div className="details-availabilty-text">{props.weekends}</div>
					</div>
				</div>
				{/* footer details */}
				<div className="footer-details">
					<div className="footer-platform-box">
						{/* <i className={`platform-icon pi pi-discord`}></i> */}
						{props.preferred_platform === 1 ? (
							<img
								className="footer-platform-image"
								src="/assets/discord-logo-small.png"
								alt={`${props.username} discord`}
							/>
						) : (
							<></>
						)}
						{props.preferred_platform === 2 ? (
							<img className="footer-platform-image" src="/assets/psn-logo-small.png" alt={`${props.username} psn`} />
						) : (
							<></>
						)}
						{props.preferred_platform === 3 ? (
							<img className="footer-platform-image" src="/assets/xbox-logo-small.png" alt={`${props.username} xbox`} />
						) : (
							<></>
						)}
					</div>
					<div className="footer-timestamp">{lastSeen}</div>
				</div>
			</div>
		</div>
	);
}
