import './gangsList.scss';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useLocation } from 'react-router-dom';
import { getMyGangTiles } from '../../utils/rest';
import GangTile from '../tiles/gangTile';
import BannerAlt from '../nav/banner-alt';

export default function GangsList() {
	const locationPath: string = useLocation().pathname;

	const userState = useSelector((state: RootState) => state.user.user);
	const [tilesFromDB, setTilesFromDB] = useState<any>([]);
	const [tilesFeed, setTilesFeed] = useState(<li></li>);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		fetchTilesData();
	}, []);

	//Used to render initial tiles, unfiltered
	useEffect(() => {
		turnDataIntoTiles(tilesFromDB);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tilesFromDB]);

	const fetchTilesData = async () => {
		let tiles = await getMyGangTiles(userState.id && userState.id > 0 ? userState.id : 0, 'nothing');

		console.log('teams ', tiles);
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
			<BannerAlt title='my gangs' buttonText='+ new gang' buttonLink={'/manage-gang'}></BannerAlt>
			<div className='lfm-feed'>{tilesFeed}</div>
		</div>
	);
}
