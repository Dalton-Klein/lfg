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
	const [isUploadFormShown, setIsUploadFormShown] = useState<boolean>(false);
	const [changeFormTitle, setChangeFormTitle] = useState<string>('');
	const [photoFile, setPhotoFile] = useState<any>();
	const [photoFileName, setPhotoFileName] = useState<string>('file');
	const [changeFormRender, setChangeFormRender] = useState<any>();
	const [changeFormText, setChangeFormText] = useState<string>();
	const dispatch = useDispatch();

	useEffect(() => {
		if (photoFile &&  photoFile!.name) {
			setPhotoFileName(`${photoFile.name}`);

		}
	}, [photoFile]);

	useEffect(() => {}, [userData]);

	const changeAvatar = async () => {
		if (userData.id === 0) {
			alert('You must be logged in to use avatar upload feature');
		} else {
			await setChangeFormTitle('Upload Avatar');
			await setChangeFormRender(
				<div>
					<input
						type="file"
						className="avatar-input"
						ref={hiddenFileInput}
						style={{ display: 'none' }}
						onChange={handleFileUpload}
					></input>
					<button onClick={chooseFileHandler}>Choose Photo</button>
					<div>{photoFileName}</div>
				</div>
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

	const handleFileUpload = (event:any) => {
		setPhotoFile(event.target.files[0]);
	}

	const changeSubmitHandler = async (e: any) => {
		avatarFormOut();
		setIsUploadFormShown(false);
		switch (changeFormTitle) {
			case 'Upload Avatar':
				const avatar = document.querySelector('.avatar-input');
				const url: string | undefined = await uploadAvatarCloud(userData.id, avatar);
				dispatch(updateUserAvatarUrl(url));
				uploadAvatarServer(userData.id, url!);
				setPhotoFileName('');
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
				{changeFormRender}
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
					<button className="alt-button" onClick={changeAvatar}>
						<img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
					</button>
				</div>
				<div className="my-profile-text">
					{userData.username ? userData.username : 'No user name...'}
				</div>
			</div>
			<div className="banner-container">
				<div className="prof-banner-detail-text">About</div>
				<div className="banner-change-box">
					<button className="text-only-button" onClick={() => changeTrainerInfoFunction('About')}>
						<img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
					</button>
				</div>
			</div>
			<div className="prof-banner-tiny-text">
				{userData.about ? userData.about : 'blank'}
			</div>
			<div className="banner-container">
				<div className="prof-banner-detail-text">Technologies</div>
				<div className="banner-change-box">
					<button className="text-only-button" onClick={() => changeTrainerInfoFunction('Technology')}>
						<img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
					</button>
				</div>
			</div>
			<div className="prof-banner-tiny-text">
				{userData.trainerName ? userData.trainerName : 'blank'}
			</div>
			<div className="banner-container">
				<div className="prof-banner-detail-text">Password</div>
				<div className="banner-change-box">
					<button className="text-only-button" onClick={() => changeTrainerInfoFunction('Name')}>
						<img className="edit-icon" src="/assets/editiconw.png" alt=""></img>
					</button>
				</div>
			</div>
		</div>
	);
}
