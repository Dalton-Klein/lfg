import FooterComponent from '../../nav/footerComponent';
import HeaderComponent from '../../nav/headerComponent';
import './blogArticle.scss';
import { useNavigate } from 'react-router-dom';
import BannerTitle from '../../nav/banner-title';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import React, { useEffect, useState } from 'react';
import MediumTile from '../../tiles/mediumTile';

export default function BlogArticle1() {
	const navigate = useNavigate();
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

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className='article-master-container'>
				<BannerTitle
					title={'how to find great rust teammates'}
					imageLink={'https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png'}
				></BannerTitle>
				<div className='article-header-info'>
					<h4 className='article-header-date'>updated 10/15/2022</h4>
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
					<h3 className='article-sub-title'>Why is it so hard?</h3>
					<div className='article-paragraph'>
						Well, if your irl friends aren't playing this wipe or don't play at all, you have get to know someone in one
						of the most notoriously toxic playerbases. Anyone who plays Rust knows that it's 100% a terrible idea to
						team with people you meet in game. Doing so results in getting insided (betrayed and locked out of your own
						base) soon as you have something to lose. Because you can't trust anyone in game, you have to meet people
						outside of the game, and get to know each other to develop a level of trust before playing.
					</div>
				</div>
				<div className='article-content-container'>
					<h3 className='article-sub-title'>What are my options?</h3>
					<div className='article-paragraph'>
						Most people's go to option to find someone immediately available to play, is to go to a large discord server
						or popular reddit thread. What is great about these options is that a lot of people are already using them!
						What is bad about these options, is that you get the FULL spectrum of Rust players in these forums (hint
						hint). It is difficult to tell whether you will actually enjoy playing with someone on these platforms by
						what information they offer up.
					</div>
					<div className='article-paragraph'>
						On the other hand, a platform that is designed to improve the lfg experience could be what you're looking
						for! Here at gangs, you will be able to see age, timezone, hours of experience, availability all up front.
						Also, you have the ability to sort and filter potential matches based on these criteria that you value. If
						this sounds nice, help us grow our platform, and setup your matchmaking profile!
					</div>
					{conditionalAuthTile}
				</div>
				<div className='article-content-container'>
					<h3 className='article-sub-title'>Useful tips to avoid common pitfalls</h3>
					<div className='article-paragraph'>
						<li>
							Get into a voice chat with the person you intend on playing with. Chat with them for a few minutes before
							comitting to anything! You can usually get a decent first impression. If you hear some major red flags,
							don't feel bad about dropping out. It will save you a wipe full of trouble.{' '}
						</li>
						<li>
							If you join a group where multiple people have just joined, try to get on the good side of as many group
							members as you can. That way if the group implodes and it turns into an "us or them" situation, you will
							likely have allies on the winning side.{' '}
						</li>
						<li>
							Generally try to play with people in the same age group and availability as yourself. The age gaps cause
							obvious issues. Having a similar amount of time committment as your squad ensures everyone is seen as
							contributing roughly equal.{' '}
						</li>
						<li>
							Remember, there's always next wipe. If you like the group you are playing with, do everything you can now
							to make sure the group is on solid footing so next wipe can go even better. If things are going terribly
							and you get insided, no shame is coming back next wipe and starting fresh.{' '}
						</li>
					</div>
				</div>
				<div className='article-content-container'>
					<h3 className='article-sub-title'>Final Thoughts</h3>
					<div className='article-paragraph'>
						You will never meet your dream team unless you are rolling the dice. Try out a few different styles of
						groups to not only learn more about the game, but help refine what you are looking for in a Rust group. The
						more experience you get, the more valuable of a teammate you are, which will assist in other great players
						wanting to stick with you!
					</div>
					<div className='article-closing'>Happy Gaming,</div>
					<div className='article-closing'>gangs.gg team</div>
				</div>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
