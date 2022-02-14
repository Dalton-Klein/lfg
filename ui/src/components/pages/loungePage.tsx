import React from 'react';
import HeaderComponent from '../nav/headerComponent';
import LoungePost from '../tiles/loungePost'
import '../../styling/loungePage.scss';

export default function loungePage() {

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
		<LoungePost {...post}></LoungePost>
	));

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className="feed">{postsFeed}</div>
		</div>
	);
}
