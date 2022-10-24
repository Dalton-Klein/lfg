import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
	checkGeneralProfileCompletion,
	checkRocketLeagueProfileCompletion,
	checkRustProfileCompletion,
} from '../../utils/rest';
import ProfileWidget from './profileWidget';
import './profileWidgetsContainer.scss';

const ProfileWidgetsContainer = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		updateWidgets() {
			setCompletenessWidget();
		},
	}));
	const userData = useSelector((state: RootState) => state.user.user);

	const [connectionCount, setconnectionCount] = useState<number>(0);
	const [genProfileComplete, setgenProfileComplete] = useState<any>(<> </>);
	const [rustProfileComplete, setrustProfileComplete] = useState<any>(<> </>);
	const [rocketLeagueProfileComplete, setrocketLeagueProfileComplete] = useState<any>(<> </>);

	useEffect(() => {
		//Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
		if (userData.email && userData.email !== '') {
			setCompletenessWidget();
			setconnectionCount(parseInt(userData.connection_count_sender) + parseInt(userData.connection_count_acceptor));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData]);

	const setCompletenessWidget = async () => {
		// ***When more games get rolled out, this will need to be modified***
		//Check general completion
		let completenessResult = await checkGeneralProfileCompletion(userData.id, '');
		if (completenessResult.status === 'error') {
			// If error start checking problem fields to determine what profiles incomplete
			//Check for overlap in general fields
			setgenProfileComplete(<i className='pi pi-times' />);
		} else {
			//If no error set all completeness to checked
			setgenProfileComplete(<i className='pi pi-check-circle' />);
		}
		//Check rust completion
		completenessResult = await checkRustProfileCompletion(userData.id, '');
		if (completenessResult.status === 'error') {
			setrustProfileComplete(<i className='pi pi-times' />);
		} else {
			setrustProfileComplete(<i className='pi pi-check-circle' />);
		}
		//Check rocket_league completion
		completenessResult = await checkRocketLeagueProfileCompletion(userData.id, '');
		if (completenessResult.status === 'error') {
			setrocketLeagueProfileComplete(<i className='pi pi-times' />);
		} else {
			setrocketLeagueProfileComplete(<i className='pi pi-check-circle' />);
		}
	};
	return (
		<div className='widgets-container'>
			<ProfileWidget value={connectionCount} label={'connections'}></ProfileWidget>
			<ProfileWidget value={genProfileComplete} label={'gen profile completed?'}></ProfileWidget>
			<ProfileWidget value={rustProfileComplete} label={'rust profile completed?'}></ProfileWidget>
			<ProfileWidget value={rocketLeagueProfileComplete} label={'r.l. profile completed?'}></ProfileWidget>
		</div>
	);
});
export default ProfileWidgetsContainer;
