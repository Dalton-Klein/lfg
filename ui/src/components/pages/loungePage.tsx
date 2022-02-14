import React from 'react';
import HeaderComponent from '../nav/headerComponent';
import '../../styling/loungePage.scss';

export default function loungePage() {
	console.log('loaded the lounge page!@!!');
	let profileImage = '/assets/avatarIcon.png';

	let postsFeed: React.ReactNode = <li></li>;
	let postsFromDataBase = [
		{
			id: 1,
			owner: 1,
			ownerName: 'Madison',
			content: 'This is a test post!',
			created_at: Date.now(),
		},
		{
			id: 2,
			owner: 2,
			ownerName: 'Dalton',
			content: 'This is a test post222222!',
			created_at: Date.now(),
		},
		{
			id: 3,
			owner: 3,
			ownerName: 'Tony',
			content:
				'This is a test post222222! My story is so special. I was a wonderful child. I get fucked up on onies every night. ',
			created_at: Date.now(),
		},
	];
	postsFeed = postsFromDataBase.map((post: any) => (
		<div className="post-container">
			<div className="post">
				<div className="post-avatar-container">
					<img
						className="nav-overlay-img"
						onClick={() => {}}
						src={profileImage}
						alt="avatar Icon"
					/>
				</div>
				<div className="post-content">
					<div>{post.ownerName}</div>
					<div>{post.created_at}</div>
					<div>{post.content}</div>
				</div>
			</div>
			<div className="post-divider"></div>
		</div>
	));

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className="feed">{postsFeed}</div>
		</div>
	);
}
