/* eslint-disable */
import './profileGeneral.scss';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateUserThunk } from '../../store/userSlice';
import { updateUserField } from '../../utils/rest';
import { Toast } from 'primereact/toast';
import ReactTooltip from 'react-tooltip';

type Props = {
	changeBanner: any;
};

export default function AccountSettings(props: Props) {
	const dispatch = useDispatch();
	const userData = useSelector((state: RootState) => state.user.user);

	//Profile Fields Form Tracking
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
	const [isEmailNotifications, setIsEmailNotifications] = useState<boolean>(true);
	const [isEmailMarketing, setIsEmailMarketing] = useState<boolean>(true);
	//End Profile Fields Form Tracking

	const toast: any = useRef({ current: '' });

	useEffect(() => {
		loadSavedInfo();
		props.changeBanner('https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//Setup hook for when url changes to track what banner image should be
	const pathname = window.location.pathname;
	useEffect(() => {
		//Gen profile needs this block to manually set image for the gen profile page
		//Game profiles house seperate logic to change banner
		props.changeBanner('https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png');
	}, [pathname]);

	useEffect(() => {
		//Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
		if (userData.email && userData.email !== '') {
			setIsEmailNotifications(userData.is_email_notifications);
			setIsEmailMarketing(userData.is_email_marketing);
		}
	}, [userData]);

	// BEGIN Logic to load saved values to ui
	const loadSavedInfo = () => {
		dispatch(updateUserThunk(userData.id));
	};
	// End Logic to load saved values to ui

	//NON-MODAL SAVE LOGIC
	const saveChanges = async () => {
		if (userData.is_email_notifications !== isEmailNotifications) {
			await updateUserField(userData.id, 'is_email_notifications', isEmailNotifications);
		}
		if (userData.is_email_marketing !== isEmailMarketing) {
			await updateUserField(userData.id, 'is_email_marketing', isEmailMarketing);
		}
		// After all data is comitted to db, get fresh copy of user object to update state
		dispatch(updateUserThunk(userData.id));
		setHasUnsavedChanges(false);
		toast.current.clear();
		toast.current.show({
			severity: 'success',
			summary: 'changes saved!',
			detail: ``,
			sticky: false,
		});
	};

	const deleteAccount = () => {
		toast.current.clear();
		toast.current.show({
			severity: 'info',
			summary: 'feature coming soon!',
			detail: ``,
			sticky: false,
		});
	};

	return (
		<div className='profile-master'>
			<Toast ref={toast} />
			{/* START ACCOUNT SETTINGS */}
			<div className='submenu-container'>
				<div className='banner-container'>
					<div className='prof-banner-detail-text'>email notifications</div>
					<input
						checked={isEmailNotifications}
						onChange={() => {
							setIsEmailNotifications(!isEmailNotifications);
							setHasUnsavedChanges(true);
						}}
						className='react-switch-checkbox'
						id={`react-switch-emails-notifications`}
						type='checkbox'
					/>
					<label className='react-switch-label' htmlFor={`react-switch-emails-notifications`}>
						<span className={`react-switch-button`} />
					</label>
				</div>
				<div className='banner-container'>
					<div className='prof-banner-detail-text'>email news/offers</div>

					<input
						checked={isEmailMarketing}
						onChange={() => {
							setIsEmailMarketing(!isEmailMarketing);
							setHasUnsavedChanges(true);
						}}
						className='react-switch-checkbox'
						id={`react-switch-emails-marketing`}
						type='checkbox'
					/>
					<label className='react-switch-label' htmlFor={`react-switch-emails-marketing`}>
						<span className={`react-switch-button`} />
					</label>
				</div>
				<div className='gradient-bar'></div>
				{/* PASSWORD */}
				{/* ***DISABLED UNTIL CODED PROPERLY */}
				{/* <div className='banner-container'>
					<div className='prof-banner-detail-text' data-tip data-for='passwordTip'>
						password
					</div>
					<div className='banner-change-box'>
						<button className='text-only-button' onClick={() => startEditingAvatar('password')}>
							<img className='edit-icon' src='/assets/editiconw.png' alt='edit password'></img>
						</button>
					</div>
				</div>
				<div className='gradient-bar'></div> */}
				{/* END PASSWORD */}
				{/* START Delete Account */}
				<div className='save-box'>
					<button className='save-button' onClick={() => deleteAccount()}>
						delete account
					</button>
				</div>
				{/* END Delete Account */}
				{/* START SAVE BOX */}
				<div className='save-box'>
					<button className='save-button' disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
						save
					</button>
				</div>
				{/* END SAVE BOX */}
			</div>

			<ReactTooltip id='passwordTip' place='right' effect='solid'>
				You can change your password here. No password edit is required to complete profile. Will have no affect on
				google auth accounts.
			</ReactTooltip>
		</div>
	);
}
