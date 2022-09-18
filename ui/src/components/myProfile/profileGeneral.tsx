/* eslint-disable */
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateUserAvatarUrl, updateUserName, updateUserThunk } from '../../store/userSlice';
import './profileGeneral.scss';
import { avatarFormIn, avatarFormOut } from '../../utils/animations';
import {
	uploadAvatarCloud,
	uploadAvatarServer,
	updateGeneralInfoField,
	updateRustInfoField,
	attemptPublishRustProfile,
} from '../../utils/rest';
import SelectComponent from './selectComponent';
import { languageOptions, regionOptions } from '../../utils/selectOptions';
import ExpandedProfile from '../modal/expandedProfileComponent';
import CustomInputSwitch from '../forms/inputSwitch';
import { Toast } from 'primereact/toast';

export default function ProfileGeneral(props: any) {
	const dispatch = useDispatch();
	const avatarPlaceholder = '/assets/avatarIcon.png';
	const hiddenFileInput: any = React.useRef(null);
	const userData = useSelector((state: RootState) => state.user.user);
	const [isProfileDiscoverable, setIsProfileDiscoverable] = useState<boolean>(false);
	const [isUploadFormShown, setIsUploadFormShown] = useState<boolean>(false);
	//View Profile
	const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
	//Profile Fields Form Tracking
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
	const [photoFile, setPhotoFile] = useState<File>({ name: '' } as File);
	const [aboutText, setAboutText] = useState<string>('');
	const [ageText, setAgeText] = useState<number>(0);
	const [gender, setGender] = useState<number>(0);
	const [region, setRegion] = useState<any>({ label: 'region' });
	const [language, setLanguage] = useState<any>({ label: 'language' });
	const [platform, setPlatform] = useState<number>(0);
	const [discord, setDiscord] = useState<string>('');
	const [psn, setPSN] = useState<string>('');
	const [xbox, setXbox] = useState<string>('');
	const [rustHoursText, setRustHoursText] = useState<number>(0);
	const [rustWeekday, setRustWeekday] = useState<string>('');
	const [rustWeekend, setRustWeekend] = useState<string>('');
	//End Profile Fields Form Tracking

	const toast: any = useRef({ current: '' });
	const regionRef: any = useRef({ current: '' });
	const languageRef: any = useRef({ current: '' });

	const loadSavedInfo = () => {
		dispatch(updateUserThunk(userData.id));
		if (userData.email && userData.email !== '') {
			console.log('user data: ', userData);
			setAboutText(userData.about === null ? '' : userData.about);
			setAgeText(userData.age === null ? 0 : userData.age);
			setGender(userData.gender === null ? 0 : userData.gender);
			setLanguage(
				userData.languages === null
					? { label: 'language' }
					: languageOptions.find(({ value }) => value === userData.languages)
			);
			setRegion(
				userData.region_name === null
					? { label: 'region' }
					: regionOptions.find(({ label }) => label === userData.region_name)
			);
			setPlatform(userData.preferred_platform === null ? 0 : userData.preferred_platform);
			setDiscord(userData.discord === null ? '' : userData.discord);
			setPSN(userData.psn === null ? '' : userData.psn);
			setXbox(userData.xbox === null ? '' : userData.xbox);
			setRustHoursText(userData.rust_hours === null ? '' : userData.rust_hours);
			setRustWeekday(userData.rust_weekdays === null ? '' : userData.rust_weekdays);
			setRustWeekend(userData.rust_weekends === null ? '' : userData.rust_weekends);
			setIsProfileDiscoverable(userData.rust_is_published);
		}
	};

	useEffect(() => {
		loadSavedInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Logic to load saved values to ui
	useEffect(() => {
		languageRef.current.detectChangeFromParent(language);
	}, [language]);

	useEffect(() => {
		regionRef.current.detectChangeFromParent(region);
	}, [region]);

	// End Logic to load saved values to ui

	// BEGIN Toggle Profile Modal
	const toggleExpandedProfile = () => {
		setExpandedProfileVis(!expandedProfileVis);
	};
	// END Toggle Profile Modal

	// BEGIN AVATAR LOGIC
	const chooseFileHandler = (event: any) => {
		if (hiddenFileInput.current !== null) {
			hiddenFileInput.current!.click();
		}
	};
	const handleFileUpload = (event: any) => {
		setPhotoFile(event.target.files[0]);
	};
	const closeAvatar = () => {
		avatarFormOut();
		setIsUploadFormShown(false);
	};
	const startEditingAvatar = async (field: string) => {
		if (userData.id === 0) alert('You must be logged in to edit this field');
		setIsUploadFormShown(true);
		avatarFormIn();
	};
	// END AVATAR LOGIC

	const changeSelectedGender = (selection: number) => {
		if (gender !== selection) setHasUnsavedChanges(true);
		setGender(selection);
	};

	const changeRegion = (selection: any) => {
		if (region !== selection.value) setHasUnsavedChanges(true);
		console.log('region: ', selection.value);
		setRegion(selection);
	};

	const changeLanguage = (selection: any) => {
		if (language.value !== selection.value) setHasUnsavedChanges(true);
		console.log('language: ', selection.value);
		setLanguage(selection);
	};

	const changeSelectedPlatform = (selection: number) => {
		if (platform !== selection) setHasUnsavedChanges(true);
		setPlatform(selection);
	};

	const changeRustWeekday = (selection: string) => {
		if (rustWeekday !== selection) setHasUnsavedChanges(true);
		setRustWeekday(selection);
	};

	const changeRustWeekend = (selection: string) => {
		if (rustWeekend !== selection) setHasUnsavedChanges(true);
		setRustWeekend(selection);
	};

	const tryPublishRustProfile = async () => {
		if (!isProfileDiscoverable) {
			//execute http req
			const result = await attemptPublishRustProfile(userData.id, '');
			console.log('res? ', result);
			if (result.status === 'success') {
				await updateRustInfoField(userData.id, 'is_published', true);
				setIsProfileDiscoverable(true);
				toast.current.clear();
				toast.current.show({
					severity: 'success',
					summary: 'rust profile published!',
					detail: ``,
					sticky: false,
				});
			} else if (result.data.length) {
				let fieldsString = '';
				result.data.forEach((field: any) => {
					fieldsString += `${field},  `;
				});
				fieldsString = fieldsString.slice(0, -3);
				//error handling here
				toast.current.clear();
				toast.current.show({
					severity: 'warn',
					summary: 'missing profile fields: ',
					detail: `${fieldsString}`,
					sticky: true,
				});
			}
		} else {
			await updateRustInfoField(userData.id, 'is_published', false);
			setIsProfileDiscoverable(false);
			toast.current.clear();
			toast.current.show({
				severity: 'success',
				summary: 'rust profile now hidden!',
				detail: ``,
				sticky: false,
			});
		}
		// After all data is comitted to db, get fresh copy of user object to update state
		dispatch(updateUserThunk(userData.id));
	};

	//MODAL SAVE LOGIC
	const changeSubmitHandler = async (e: any) => {
		avatarFormOut();
		setIsUploadFormShown(false);
		const avatar = document.querySelector('.avatar-input');
		const url: string | undefined = await uploadAvatarCloud(avatar);
		dispatch(updateUserAvatarUrl(url));
		uploadAvatarServer(userData.id, url!);
		setPhotoFile({ name: '' } as File);
	};

	//NON-MODAL SAVE LOGIC
	const saveChanges = async () => {
		const availabilityValues: any = {
			none: 1,
			some: 2,
			'a lot': 3,
			'all day': 4,
		};
		const rustWeekdayIdValue = availabilityValues[rustWeekday];
		const rustWeekendIdValue = availabilityValues[rustWeekend];
		if (userData.about !== aboutText) await updateGeneralInfoField(userData.id, 'about', aboutText);
		if (parseInt(userData.age) !== ageText) await updateGeneralInfoField(userData.id, 'age', ageText);
		if (userData.gender !== gender) await updateGeneralInfoField(userData.id, 'gender', gender);
		if (region && userData.region !== region.value) await updateGeneralInfoField(userData.id, 'region', region.value);
		if (language && userData.language !== language.value) {
			await updateGeneralInfoField(userData.id, 'languages', language.value);
		}
		if (userData.preferred_platform !== platform)
			await updateGeneralInfoField(userData.id, 'preferred_platform', platform);
		if (userData.discord !== discord) await updateGeneralInfoField(userData.id, 'discord', discord);
		if (userData.psn !== psn) await updateGeneralInfoField(userData.id, 'psn', psn);
		if (userData.xbox !== xbox) await updateGeneralInfoField(userData.id, 'xbox', xbox);
		if (userData.rust_hours !== rustHoursText) await updateRustInfoField(userData.id, 'hours', rustHoursText);
		if (userData.rust_weekdays !== rustHoursText) {
			await updateRustInfoField(userData.id, 'weekdays', rustWeekdayIdValue);
		}
		if (userData.rust_weekends !== rustHoursText) {
			await updateRustInfoField(userData.id, 'weekends', rustWeekendIdValue);
		}
		console.log('user data: ', userData);
		// After all data is comitted to db, get fresh copy of user object to update state
		dispatch(updateUserThunk(userData.id));
		setHasUnsavedChanges(false);
		toast.current.clear();
	};

	const conditionalClass = isUploadFormShown ? 'conditionalZ2' : 'conditionalZ1';
	return (
		<div className="my-profile-containers">
			<Toast ref={toast} />
			{/* Conditionally render hamburger modal */}
			{expandedProfileVis ? (
				<ExpandedProfile
					toggleExpandedProfile={toggleExpandedProfile}
					userInfo={userData}
					refreshTiles={() => {}}
					showConnectForm={false}
				/>
			) : (
				<></>
			)}
			<div className="submenu-container" style={{ display: props.submenuId === 1 ? 'inline-block' : 'none' }}>
				{/* EDIT PHTO MODAL */}
				<div className={`edit-profile-form ${conditionalClass}`}>
					<p>{'upload avatar'}</p>
					{
						<div className="avatar-upload-form">
							<input
								className="avatar-input"
								type="file"
								ref={hiddenFileInput}
								style={{ display: 'none' }}
								onChange={handleFileUpload}
							></input>
							<button onClick={chooseFileHandler} className="upload-form-btns">
								choose photo
							</button>
							<div className="photo-label">{photoFile ? photoFile.name : ''}</div>
						</div>
					}
					<div className="upload-form-btns">
						<button onClick={changeSubmitHandler}>save</button>
						<button onClick={closeAvatar}>close</button>
					</div>
				</div>
				{/* AVATAR PHTO */}
				<div className="banner-container-top">
					{!userData.avatar_url || userData.avatar_url === '/assets/avatarIcon.png' ? (
						<div className="dynamic-avatar-bg" onClick={() => startEditingAvatar('avatar_url')}>
							<div className="dynamic-avatar-text">
								{userData.username
									.split(' ')
									.map((word: string[]) => word[0])
									.join('')
									.slice(0, 2)}
							</div>
						</div>
					) : (
						<img
							className="prof-banner-avatar"
							src={userData.avatar_url}
							alt=""
							onClick={() => startEditingAvatar('avatar_url')}
						></img>
					)}

					<button
						className="expand-button"
						onClick={() => {
							toggleExpandedProfile();
						}}
					>
						<i className="pi pi-plus" />
						&nbsp; view my profile
					</button>
				</div>
				<div className="gradient-bar"></div>
				{/* DISPLAY NAME */}
				<div className="banner-container-username">
					<div className="my-profile-text">{userData.username ? userData.username : 'No user name...'}</div>
				</div>
				<div className="gradient-bar"></div>
				{/* ABOUT */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">about</div>
					<input
						onChange={(event) => {
							setAboutText(event.target.value);
							setHasUnsavedChanges(true);
						}}
						value={aboutText ? aboutText : ''}
						type="text"
						className="input-box"
						placeholder={userData.about && userData.about !== null && userData.about !== '' ? userData.about : 'blank'}
					></input>
				</div>
				<div className="gradient-bar"></div>
				{/* END ABOUT */}
				{/* AGE */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">age</div>
					<input
						onChange={(event) => {
							setAgeText(parseInt(event.target.value));
							setHasUnsavedChanges(true);
						}}
						value={ageText ? ageText : ''}
						type="number"
						className="input-box"
						placeholder={userData.age && userData.age !== null && userData.age !== '' ? userData.age : 'blank'}
					></input>
				</div>
				<div className="gradient-bar"></div>
				{/* END AGE */}
				{/* GENDER */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">gender</div>
					<div className="banner-change-box"></div>
					<div className="gender-container">
						<div
							className={`gender-box ${gender === 1 ? 'box-selected' : ''}`}
							onClick={() => {
								changeSelectedGender(1);
							}}
						>
							<img className="gender-icon" src={'/assets/gender-icon-male.png'} alt=""></img>
							<div className="box-text">m</div>
						</div>
						<div
							className={`gender-box ${gender === 2 ? 'box-selected' : ''}`}
							onClick={() => {
								changeSelectedGender(2);
							}}
						>
							<img className="gender-icon" src={'/assets/gender-icon-female.png'} alt=""></img>
							<div className="box-text">f</div>
						</div>
						<div
							className={`gender-box ${gender === 3 ? 'box-selected' : ''}`}
							onClick={() => {
								changeSelectedGender(3);
							}}
						>
							<img className="gender-icon" src={'/assets/gender-icon-non-binary.png'} alt=""></img>
							<div className="box-text">nb</div>
						</div>
					</div>
				</div>
				<div className="gradient-bar"></div>
				{/* END GENDER */}
				{/* REGION */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">region</div>
					<div className="select-container">
						<SelectComponent
							publicMethods={regionRef}
							title="region"
							options={regionOptions}
							multi={false}
							setSelection={changeRegion}
							selection={region}
						></SelectComponent>
					</div>
				</div>
				<div className="gradient-bar"></div>
				{/* END REGION */}
				{/* LANGUAGE */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">language</div>
					<div className="select-container">
						<SelectComponent
							publicMethods={languageRef}
							title="language"
							options={languageOptions}
							multi={false}
							setSelection={changeLanguage}
							selection={language}
						></SelectComponent>
					</div>
				</div>
				<div className="gradient-bar"></div>
				{/* END LANGUAGE */}
				{/* PLATFORM */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">platform</div>
					<div className="gender-container">
						<div
							className={`gender-box ${platform === 1 ? 'box-selected' : ''}`}
							onClick={() => {
								changeSelectedPlatform(1);
							}}
						>
							<img className="gender-icon" src={'/assets/discord-logo-small.png'} alt=""></img>
						</div>
						<div
							className={`gender-box ${platform === 2 ? 'box-selected' : ''}`}
							onClick={() => {
								changeSelectedPlatform(2);
							}}
						>
							<img className="gender-icon" src={'/assets/psn-logo-small.png'} alt=""></img>
						</div>
						<div
							className={`gender-box ${platform === 3 ? 'box-selected' : ''}`}
							onClick={() => {
								changeSelectedPlatform(3);
							}}
						>
							<img className="gender-icon" src={'/assets/xbox-logo-small.png'} alt=""></img>
						</div>
					</div>
				</div>
				<div className="gradient-bar"></div>
				{/* END PLATFORM */}
				{/* DISCORD */}
				{platform === 1 ? (
					<div className="banner-container">
						<div className="prof-banner-detail-text">discord name</div>
						<input
							onChange={(event) => {
								setDiscord(event.target.value);
								setHasUnsavedChanges(true);
							}}
							value={discord ? discord : ''}
							type="text"
							className="input-box"
							placeholder={userData.discord ? userData.discord : 'blank'}
						></input>
					</div>
				) : (
					<></>
				)}
				{/* END DISCORD */}
				{/* PLAYSTATION */}
				{platform === 2 ? (
					<div className="banner-container">
						<div className="prof-banner-detail-text">psn name</div>
						<input
							onChange={(event) => {
								setPSN(event.target.value);
								setHasUnsavedChanges(true);
							}}
							value={psn ? psn : ''}
							type="text"
							className="input-box"
							placeholder={userData.psn ? userData.psn : 'blank'}
						></input>
					</div>
				) : (
					<></>
				)}
				{/* END PLAYSTATION */}
				{/* XBOX */}
				{platform === 3 ? (
					<div className="banner-container">
						<div className="prof-banner-detail-text">xbox name</div>
						<input
							onChange={(event) => {
								setXbox(event.target.value);
								setHasUnsavedChanges(true);
							}}
							value={xbox ? xbox : ''}
							type="text"
							className="input-box"
							placeholder={userData.xbox ? userData.xbox : 'blank'}
						></input>
					</div>
				) : (
					<></>
				)}
				{/* END XBOX */}
				<div className="gradient-bar"></div>
				{/* PASSWORD */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">password</div>
					<div className="banner-change-box">
						<button className="text-only-button" onClick={() => startEditingAvatar('password')}>
							<img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
						</button>
					</div>
				</div>
				<div className="gradient-bar"></div>
				{/* END PASSWORD */}
				{/* START SAVE BOX */}
				<div className="save-box">
					<button className="save-button" disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
						save
					</button>
				</div>
				{/* END SAVE BOX */}
			</div>

			{/* START ACCOUNT SETTINGS */}

			<div className="submenu-container" style={{ display: props.submenuId === 6 ? 'inline-block' : 'none' }}>
				<div className="banner-container">
					<div className="prof-banner-detail-text">email notifications</div>
					{/* <CustomInputSwitch
						isToggled={isProfileDiscoverable}
						onToggle={() => {
							//setIsProfileDiscoverable(!isProfileDiscoverable);
						}}
					></CustomInputSwitch> */}
				</div>
				<div className="banner-container">
					<div className="prof-banner-detail-text">email news/offers</div>
					{/* <CustomInputSwitch
						isToggled={isProfileDiscoverable}
						onToggle={() => {
							//setIsProfileDiscoverable(!isProfileDiscoverable);
						}}
					></CustomInputSwitch> */}
				</div>
			</div>

			{/* START RUST SETTINGS */}

			<div className="submenu-container" style={{ display: props.submenuId === 7 ? 'inline-block' : 'none' }}>
				<div className="banner-container">
					<div className="prof-banner-detail-text">publish rust profile</div>
					<input
						checked={isProfileDiscoverable}
						onChange={() => {
							tryPublishRustProfile();
						}}
						className="react-switch-checkbox"
						id={`react-switch-new`}
						type="checkbox"
					/>
					<label className="react-switch-label" htmlFor={`react-switch-new`}>
						<span className={`react-switch-button`} />
					</label>
				</div>
				<div className="gradient-bar"></div>
				{/* RUST HOURS */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">hours played</div>
					<input
						onChange={(event) => {
							setRustHoursText(parseInt(event.target.value));
							setHasUnsavedChanges(true);
						}}
						value={rustHoursText ? rustHoursText : ''}
						type="number"
						className="input-box"
						placeholder={userData.hours && userData.hours !== null && userData.hours !== '' ? userData.hours : 'none'}
					></input>
				</div>
				<div className="gradient-bar"></div>
				{/* END RUST HOURS */}
				{/* Availability- Weekdays */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">weekdays</div>
					<div className="gender-container">
						<div
							className={`gender-box ${rustWeekday === 'none' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekday('none');
							}}
						>
							none
						</div>
						<div
							className={`gender-box ${rustWeekday === 'some' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekday('some');
							}}
						>
							some
						</div>
						<div
							className={`gender-box ${rustWeekday === 'a lot' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekday('a lot');
							}}
						>
							a lot
						</div>
						<div
							className={`gender-box ${rustWeekday === 'all day' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekday('all day');
							}}
						>
							all day
						</div>
					</div>
				</div>
				<div className="gradient-bar"></div>
				{/* END Availability- Weekdays */}
				{/* Availability- Weekends */}
				<div className="banner-container">
					<div className="prof-banner-detail-text">weekdays</div>
					<div className="gender-container">
						<div
							className={`gender-box ${rustWeekend === 'none' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekend('none');
							}}
						>
							none
						</div>
						<div
							className={`gender-box ${rustWeekend === 'some' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekend('some');
							}}
						>
							some
						</div>
						<div
							className={`gender-box ${rustWeekend === 'a lot' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekend('a lot');
							}}
						>
							a lot
						</div>
						<div
							className={`gender-box ${rustWeekend === 'all day' ? 'box-selected' : ''}`}
							onClick={() => {
								changeRustWeekend('all day');
							}}
						>
							all day
						</div>
					</div>
				</div>
				<div className="gradient-bar"></div>
				{/* END Availability- Weekends */}
				{/* START SAVE BOX */}
				<div className="save-box">
					<button className="save-button" disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
						save
					</button>
				</div>
				{/* END SAVE BOX */}
			</div>
		</div>
	);
}
