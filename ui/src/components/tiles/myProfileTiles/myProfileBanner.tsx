import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { updateUserAvatarUrl, updateUserName } from '../../../store/userSlice';
import '../../../styling/profilePage.scss';
import { avatarFormIn, avatarFormOut } from '../../../utils/animations';
import { uploadAvatarCloud, uploadAvatarServer, changeUserName } from '../../../utils/rest';

export default function ProfileBanner() {
	const hiddenFileInput: any = React.useRef(null);
	const nameInputRef: any = useRef();
	const idInputRef: any = useRef();
	const userData = useSelector((state: RootState) => state.user.user);
	const [sellerRatingValue, setSellerRatingValue] = useState<number>(0);
	const [buyerRatingValue, setBuyerRatingValue] = useState<number>(0);
	const [isUploadFormShown, setIsUploadFormShown] = useState<boolean>(false);
	const [changeFormTitle, setChangeFormTitle] = useState<string>('');
	const [changeFormRender, setChangeFormRender] = useState<any>();
	const [changeFormText, setChangeFormText] = useState<string>();
	const [formattedTrainerCode, setFormattedTrainerCode] = useState<string>('none');
	const dispatch = useDispatch();

	useEffect(() => {}, []);

	useEffect(() => {}, [userData]);

	const changeAvatar = async () => {
		if (userData.id === 0) {
			alert('You must be logged in to use avatar upload feature');
		} else {
			await setChangeFormTitle('Upload Avatar');
			await setChangeFormRender(
				<input type="file" className="avatar-input" ref={hiddenFileInput}></input>
			);
			setIsUploadFormShown(true);
			avatarFormIn();
		}
	};

	const chooseFileHandler = (event: any) => {
		if (hiddenFileInput.current !== null) {
			hiddenFileInput.current!.click();
		}
	};

	const changeSubmitHandler = async (e: any) => {
		avatarFormOut();
		setIsUploadFormShown(false);
		switch (changeFormTitle) {
			case 'Upload Avatar':
				const avatar = document.querySelector('.avatar-input');
				const url: string | undefined = await uploadAvatarCloud(userData.id, avatar);
				dispatch(updateUserAvatarUrl(url));
				uploadAvatarServer(userData.id, url!);
				break;
			case 'Update Name':
				dispatch(updateUserName(changeFormText));
				changeUserName(userData.id, changeFormText!);
				await setChangeFormText('');
				nameInputRef.current.value = '';
				break;
		}
	};

	const closeAvatar = () => {
		avatarFormOut();
		setIsUploadFormShown(false);
	};

	const changeTrainerInfoFunction = async (idOrName: string) => {
		let idTNameF = false;
		if (idOrName === 'Name') idTNameF = true;
		else idTNameF = false;
		if (userData.id === 0) {
			alert('You must be logged in to edit this field');
		} else {
			await setChangeFormTitle(`Update ${idOrName}`);
			await setChangeFormRender(
				<input
					onChange={(event) => {
						setChangeFormText(event.target.value);
					}}
					value={changeFormText}
					type="text"
					className="avatar-input"
					placeholder="Type here..."
					ref={idTNameF ? nameInputRef : idInputRef}
				></input>
			);
			setIsUploadFormShown(true);
			avatarFormIn();
		}
	};

	const conditionalClass = isUploadFormShown ? 'conditionalZ2' : 'conditionalZ1';
	return (
		<div className="my-profile-containers">
			<div className={`upload-avatar-form ${conditionalClass}`}>
				<p>{changeFormTitle}</p>
				<input
					type="file"
					className="avatar-input"
					ref={hiddenFileInput}
					style={{ display: 'none' }}
				></input>
				<button onClick={chooseFileHandler}>Choose File</button>
				<div className="upload-form-btns">
					<button onClick={changeSubmitHandler}>Submit</button>
					<button onClick={closeAvatar}>Close</button>
				</div>
			</div>
			<div className="banner-container-top">
				<div className="profile-avatar-box">
					<img
						className="prof-banner-avatar"
						src={
							userData.avatarUrl !==
							'https://res.cloudinary.com/dasb94yfb/image/upload/v1612801631/a6auhq4b9eblw0ketmlv.png'
								? userData.avatarUrl
								: '/assets/avatarIcon.png'
						}
						alt=""
					></img>
					<button className="change-avatar-btn" onClick={changeAvatar}>
						Change Avatar
					</button>
				</div>
				<div className="my-profile-text">
					{userData.username ? userData.username : 'No user name...'}
				</div>
			</div>
			<div className="banner-container">
				<div className="prof-banner-detail-text">Password</div>
				<div className="banner-change-box">
					<button className="text-only-button" onClick={() => changeTrainerInfoFunction('Name')}>
						<img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
					</button>
				</div>
			</div>
			<div className="banner-container">
				<div className="prof-banner-detail-text">Technologies</div>
				<div className="banner-change-box">
					<div className="prof-banner-tiny-text">
						{userData.trainerName ? userData.trainerName : 'none'}
					</div>
					<button className="text-only-button" onClick={() => changeTrainerInfoFunction('Name')}>
						<img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
					</button>
				</div>
			</div>
		</div>
	);
}
