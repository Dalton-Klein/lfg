import React, { useEffect, useState } from 'react';
import HeaderComponent from '../nav/headerComponent';
import LoungePost from '../tiles/loungePost';
import CreatePost from '../forms/createPost';
import { getPosts } from '../../utils/rest';
import '../../styling/loungePage.scss';

export default function loungePage() {
	let postsFeed: React.ReactNode = <li></li>;
	const [postsFromDataBase, setPostsFromDataBase] = useState([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		setPostsFromDataBase(await getPosts(1, 'blank'));
		console.log('trying to get posts', postsFromDataBase);
	};

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
