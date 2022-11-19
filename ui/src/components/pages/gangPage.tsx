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
	const [gangId, setgangId] = useState<number>(0);

	useEffect(() => {
		setgangId(parseInt(locationPath.substring(locationPath.lastIndexOf('/') + 1)));
		console.log('locationpath: ', gangId);
		getGangActivity(gangId, userState.id, '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div>gang info </div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
