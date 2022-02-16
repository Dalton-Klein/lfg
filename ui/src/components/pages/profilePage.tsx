import React from 'react';
import HeaderComponent from '../nav/headerComponent';
import '../../styling/profilePage.scss';
import ProfileBanner from '../tiles/myProfileTiles/myProfileBanner';

export default function ProfilePage() {
	let profileImage = '/assets/avatarIcon.png';
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className="my-profile-container">
				<ProfileBanner></ProfileBanner>
			</div>
		</div>
	);
}
