import FooterComponent from '../../nav/footerComponent';
import HeaderComponent from '../../nav/headerComponent';
import './blogArticle.scss';
import { useNavigate } from 'react-router-dom';
import BannerTitle from '../../nav/banner-title';
import { useDispatch, useSelector } from 'react-redux';
import { setPreferences } from '../../../store/userPreferencesSlice';
import { RootState } from '../../../store/store';
import React, { useEffect, useState } from 'react';
import MediumTile from '../../tiles/mediumTile';

export default function BlogArticle2() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const preferencesState = useSelector((state: RootState) => state.preferences);
	const userState = useSelector((state: RootState) => state.user.user);

	const [conditionalAuthTile, setconditionalAuthTile] = useState<any>(true);

	useEffect(() => {
		setconditionalAuthTile(
			userState.email === '' ? (
				<MediumTile routerLink='/login' imageLink='pi pi-sign-in' title='try gangs'></MediumTile>
			) : (
				<></>
			)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			<div className='article-master-container'>
				<BannerTitle title={'rocket league & minecraft support'}></BannerTitle>
				<div className='article-header-info'>
					<h4 className='article-header-date'>updated 10/18/2022</h4>
					<button
						onClick={() => {
							navigate(`/blog`);
						}}
					>
						return to blog home
					</button>
					<h4 className='article-read-time'>2 min read</h4>
				</div>
				{/* Welcome */}
				<div className='article-content-container'>
					<h3 className='article-sub-title'>When Will Gangs Support Rocket League & Minecraft?</h3>
					<div className='article-paragraph'>
						Rocket League and Minecraft are coming soon! In short, there are some features we are working on that take
						priority over adding new games to the platform. However, Rocket League will be the second game added to
						gangs.gg, and Minecraft the third. The best estimate is within the next month, support for Rocket League
						will be released. In the next two months, Minecraft will come out.
					</div>
				</div>
				<div className='article-content-container'>
					<h3 className='article-sub-title'>How will it work?</h3>
					<div className='article-paragraph'>
						There will be new options in the discover page to switch between supported games. These views will only show
						members who have selected to publish that specific games profile. This bring us to the additions to the
						profile page. There will be an additional profile to manage for each game, with a form specific for that
						game. Once both the general and game specific profile is complete, you can publish your Rocket League or
						Minecraft profile which will make you discoverable to others. When connecting with others, the game you are
						connecting on is shown in the requests. Once the connection is accepted, the new connection will show up in
						your messaging menu.
					</div>
				</div>
				<div className='article-content-container'>
					<h3 className='article-sub-title'>Final Thoughts</h3>
					<div className='article-paragraph'>
						Rolling out new games to the platform is exciting news! If you want to keep up to date on the status of new
						releases, or to request a game to support, join our{' '}
						<a href='https://discord.gg/MMaYZ8bUQc' className='link-text'>
							{' '}
							discord
						</a>{' '}
						and let us know!
					</div>
					<div className='article-paragraph' style={{ display: userState.email === '' ? 'inline-block' : 'none' }}>
						Are you new here? Create an account and get started!
					</div>
					{conditionalAuthTile}
					<div className='article-closing'>Happy Gaming,</div>
					<div className='article-closing'>gangs.gg team</div>
				</div>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
