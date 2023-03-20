import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './gangPage.scss';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getGangActivity } from '../../utils/rest';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function GangPage() {
	const locationPath: string = useLocation().pathname;
	const userState = useSelector((state: RootState) => state.user.user);
	const [gangInfo, setgangInfo] = useState<any>({});
	const [chatList, setchatList] = useState<any>([]);

	useEffect( () => {
		const locationOfLastSlash = locationPath.lastIndexOf('/');
		const extractedGangId= locationPath.substring(locationOfLastSlash+1);
		
		console.log('locationpath: ', locationPath, parseInt(extractedGangId));
		loadGangPage(parseInt(extractedGangId));		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect( () => {
		if(gangInfo.chats) {
			turnChatsIntoTiles();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gangInfo]);

	const loadGangPage = async (id:number) => {
		const result = await getGangActivity(id, userState.id, '');
		setgangInfo(result);
	}

	const turnChatsIntoTiles = () => {
		setchatList(
			gangInfo.chats.map((tile: any) => (
				<button key={tile.id}>
					{tile.name}
				</button>
			))
		);
	};

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className='chats-container'>
				<div>{gangInfo.basicInfo?.name ? gangInfo.basicInfo.name : 'wow' }</div>
			</div>
			<div>
				{chatList}
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
