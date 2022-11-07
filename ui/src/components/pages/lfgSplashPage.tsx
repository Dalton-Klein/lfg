import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './lfgSplashPage.scss';
import DaddyTile from '../tiles/daddyTile';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import BannerTitle from '../nav/banner-title';

export default function LFGSplashPage() {
	const userState = useSelector((state: RootState) => state.user.user);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className='tile-container'>
				<div className='discover-tiles'>
					<DaddyTile
						routerLink='/lfg-rust'
						image='https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png'
						title='rust'
					></DaddyTile>
					<DaddyTile
						routerLink='/lfg-rocket-league'
						image='https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg'
						title='rocket league'
					></DaddyTile>
				</div>
				
			</div>
			
			<FooterComponent></FooterComponent>
		</div>
	);
}
