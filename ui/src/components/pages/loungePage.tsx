import React from 'react';
import HeaderComponent from '../nav/headerComponent';
import LoungePost from '../tiles/loungePost'
import '../../styling/loungePage.scss';
import moment from 'moment';

export default function loungePage() {

	let postsFeed: React.ReactNode = <li></li>;
	let postsFromDataBase = [
		{
			id: 3,
			owner: 3,
			ownerName: 'Tony',
			num_votes: 134,
			num_comments: 6,
			content:
				'This is a test post222222! My story is so special. I was a wonderful child. I get fucked up on onies every night. ',
			created_at: Date.parse('02/13/2022 14:31:30'),
		},
		{
			id: 2,
			owner: 2,
			ownerName: 'Dalton',
			num_votes: 193,
			num_comments: 56,
			content: 'This is a test post222222!',
			created_at: new Date(2022, 1, 5, 6),
		},
		{
			id: 1,
			owner: 1,
			ownerName: 'Madison',
			num_votes: 54,
			num_comments: 18,
			content: 'This is a test post!',
			created_at: new Date(2021, 10, 5, 4),
		},
	];
	postsFeed = postsFromDataBase.map((post: any) => (
		<li
            style={{ listStyleType: 'none' }}
            key={post.id}
          >
            <LoungePost {...post}></LoungePost>
        </li>
		
	));

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className="feed">{postsFeed}</div>
		</div>
	);
}
