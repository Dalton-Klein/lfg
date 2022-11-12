import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './gangsPage.scss';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useLocation } from 'react-router-dom';
import { getRocketLeagueTiles, getRustGangTiles } from '../../utils/rest';
import GangTile from '../tiles/gangTile';
import BannerAlt from '../nav/banner-alt';

export default function CreateGangsPage() {
	const locationPath: string = useLocation().pathname;

	const userState = useSelector((state: RootState) => state.user.user);
	const [tilesFromDB, setTilesFromDB] = useState<any>([]);
	const [tilesFeed, setTilesFeed] = useState(<li></li>);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//Used to render initial tiles, unfiltered
	useEffect(() => {
		turnDataIntoTiles(tilesFromDB);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tilesFromDB]);

	const fetchTilesData = async () => {
		let tiles: any = [];
		if (locationPath === '/lfg-rust') {
			tiles = await getRustGangTiles(userState.id && userState.id > 0 ? userState.id : 0, 'nothing');
		} else if (locationPath === '/lfg-rocket-league') {
			tiles = await getRocketLeagueTiles(userState.id && userState.id > 0 ? userState.id : 0, 'nothing');
		}
		setTilesFromDB(tiles);
	};

	const turnDataIntoTiles = (tileData: any) => {
		setTilesFeed(
			tileData.map((tile: any) => (
				<li style={{ listStyleType: 'none' }} key={tile.id}>
					<GangTile {...tile} refreshTiles={fetchTilesData}></GangTile>
				</li>
			))
		);
	};

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<BannerAlt title='create gang' buttonText='save changes' buttonLink={'/my-gangs'}></BannerAlt>
			{/* AVATAR PHTO */}
			{/* <div className='banner-container-top'>
				{!userData.avatar_url || userData.avatar_url === '/assets/avatarIcon.png' ? (
					<div
						className='dynamic-avatar-bg'
						onClick={() => startEditingAvatar('avatar_url')}
						data-tip
						data-for='avatarTip'
					>
						<div className='dynamic-avatar-text'>
							{userData.username
								? userData.username
										.split(' ')
										.map((word: string[]) => word[0])
										.join('')
										.slice(0, 2)
								: 'gg'}
						</div>
					</div>
				) : (
					<img
						className='prof-banner-avatar'
						src={userData.avatar_url}
						alt='my-avatar'
						onClick={() => startEditingAvatar('avatar_url')}
						data-tip
						data-for='avatarTip'
					></img>
				)}
				<button
					className='expand-button'
					onClick={() => {
						toggleExpandedProfile();
					}}
				>
					<i className='pi pi-plus' />
					&nbsp; view my profile
				</button>
			</div>
			<div className='gradient-bar'></div> */}
			{/* DISPLAY NAME */}
			{/* <div className='banner-container-username'>
				<div className='my-profile-text'>{userData.username ? userData.username : 'No user name...'}</div>
			</div>
			<div className='gradient-bar'></div> */}
			{/* ABOUT */}
			{/* <div className='banner-container'>
				<div className='prof-banner-detail-text'>about</div>
				<input
					onChange={(event) => {
						setAboutText(event.target.value);
						setHasUnsavedChanges(true);
					}}
					value={aboutText ? aboutText : ''}
					type='text'
					className='input-box'
					placeholder={userData.about && userData.about !== null && userData.about !== '' ? userData.about : 'blank'}
				></input>
			</div>
			<div className='gradient-bar'></div> */}
			{/* END ABOUT */}
			<FooterComponent></FooterComponent>
		</div>
	);
}
