import FooterComponent from '../../nav/footerComponent';
import HeaderComponent from '../../nav/headerComponent';
import './blogPage.scss';
import { useNavigate } from 'react-router-dom';
import BannerTitle from '../../nav/banner-title';
import { useDispatch, useSelector } from 'react-redux';
import { setPreferences } from '../../../store/userPreferencesSlice';
import { RootState } from '../../../store/store';
import React from 'react';
import BlogTile from './blogTile';

export default function BlogPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const preferencesState = useSelector((state: RootState) => state.preferences);

	const changeSelection = (value: number) => {
		const menuLinkKey: any = {
			1: 'profile',
			2: 'profile',
			3: 'profile',
			4: 'profile',
			5: 'profile',
			6: 'profile',
			7: 'profile',
			8: 'discover',
			9: 'login',
		};
		if (value < 8) {
			dispatch(
				setPreferences({
					...preferencesState,
					lastProfileMenu: value,
				})
			);
		}
		navigate(`/${menuLinkKey[value]}`);
	};

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className='blog-master-container'>
				<BannerTitle title={'blog'}></BannerTitle>
				{/* Welcome */}
				<div className='blog-content-container'>
					<BlogTile
						routerLink='/blog/rocket-league-minecraft-support'
						title='rocket league & minecraft support'
						updated_on='10/18/2022 | 2 min read'
						preview='Rocket League and Minecraft are coming soon! In short, there are some features we are working on that take priority over adding new games to the
						platform. However, Rocket League will be the second game...'
					></BlogTile>
					<BlogTile
						routerLink='/blog/how-to-find-great-rust-teammates'
						title='how to find great rust teammates'
						updated_on='10/15/2022 | 2 min read'
						preview="Well, if your irl friends aren't playing this wipe or don't play at all, you have get to know someone in one
						of the most notoriously toxic playerbases. Anyone who plays Rust knows..."
					></BlogTile>
				</div>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
