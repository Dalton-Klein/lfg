import React from 'react';
import HeaderComponent from '../nav/headerComponent';
import LoungePost from '../tiles/loungePost';
import CreatePost from '../forms/createPost';
import '../../styling/loungePage.scss';

export default function loungePage() {
	let postsFeed: React.ReactNode = <li></li>;
	let postsFromDataBase = [
		{
			id: 3,
			owner: 3,
			owner_name: 'Tony',
			tags: ['design'],
			num_votes: 134,
			num_comments: 6,
			content:
				'This is a test post222222! My story is so special. I was a wonderful child. I get fucked up on onies every night. ',
			created_at: Date.parse('02/13/2022 14:31:30'),
		},
		{
			id: 2,
			owner: 2,
			owner_name: 'Dalton',
			tags: ['javascript', 'react', 'bug'],
			num_votes: 193,
			num_comments: 56,
			content: 'This is a test post222222!',
			created_at: new Date(2022, 1, 5, 6),
		},
		{
			id: 1,
			owner: 1,
			owner_name: 'Madison',
			tags: ['unit_testing', 'jasmine'],
			num_votes: 54,
			num_comments: 18,
			content: 'This is a test post!',
			created_at: new Date(2021, 10, 5, 4),
		},
	];
	postsFeed = postsFromDataBase.map((post: any) => (
		<li style={{ listStyleType: 'none' }} key={post.id}>
			<LoungePost {...post}></LoungePost>
		</li>
	));

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<CreatePost></CreatePost>
			<div className="feed">{postsFeed}</div>
		</div>
	);
}
