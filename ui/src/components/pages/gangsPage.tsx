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

export default function GangsPage() {
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
			<BannerAlt title='my gangs' buttonText='+ new gang' buttonLink={'/my-gangs'}></BannerAlt>
			<div className='lfm-feed'>{tilesFeed}</div>

			<FooterComponent></FooterComponent>
		</div>
	);
}
