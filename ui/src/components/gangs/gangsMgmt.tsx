import { avatarFormIn, avatarFormOut } from '../../utils/animations';
import './gangsMgmt.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useLocation } from 'react-router-dom';
import { getRocketLeagueTiles, getRustGangTiles, updateGangInfoField } from '../../utils/rest';
import GangTile from '../tiles/gangTile';
import BannerTitle from '../nav/banner-title';
import { Toast } from 'primereact/toast';

type Props = {
  gangId: number;
};

export default function GangsMgmt(props: Props) {
  const locationPath: string = useLocation().pathname;
  const hiddenFileInput: any = React.useRef(null);
  const userState = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: '' });

  const [hasUnsavedChanges, sethasUnsavedChanges] = useState<boolean>(false);
  const [isUploadFormShown, setisUploadFormShown] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>({ name: '' } as File);
  const [nameText, setnameText] = useState<string>('');
  const [aboutText, setaboutText] = useState<string>('');
  const [chatPlatform, setchatPlatform] = useState<number>(0);
  const [game, setgame] = useState<number>(0);
  const [isPublic, setisPublic] = useState<boolean>(true);
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

  const changeSelectedPlatform = (selection: number) => {
    if (chatPlatform !== selection) sethasUnsavedChanges(true);
    setchatPlatform(selection);
    return;
  };

  const changeSelectedGame = (selection: number) => {
    if (game !== selection) sethasUnsavedChanges(true);
    setgame(selection);
    return;
  };

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

  //START AVATAR EDIT LOGIC
  const chooseFileHandler = (event: any) => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current!.click();
    }
    return;
  };
  const handleFileUpload = (event: any) => {
    setPhotoFile(event.target.files[0]);
    return;
  };
  const closeAvatar = () => {
    avatarFormOut();
    setisUploadFormShown(false);
    return;
  };
  const startEditingAvatar = async (field: string) => {
    if (userState.id === 0) alert('You must be logged in to edit this field');
    setisUploadFormShown(true);
    avatarFormIn();
    return;
  };
  //END AVATAR EDIT LOGIC

  //START NON-MODAL SAVE LOGIC
  const saveChanges = async () => {
    if (userState.about !== aboutText) await updateGangInfoField(userState.id, 'about', aboutText);
    // After all data is comitted to db, get fresh copy of user object to update state

    // dispatch(updateUserThunk(userState.id));
    // setHasUnsavedChanges(false);
    // toast.current.clear();
    // toast.current.show({
    //   severity: 'success',
    //   summary: 'changes saved!',
    //   detail: ``,
    //   sticky: false,
    // });
  };
  //END NON-MODAL SAVE LOGIC

  return (
    <div>
      <Toast ref={toast} />
      <BannerTitle title={'gang management'} imageLink={''}></BannerTitle>
      <div className='gang-mgmt-master'>
        <div className='gang-mgmt-container'>
          {/* AVATAR PHTO */}
          <div className='gang-container-top'>
            {!userState.avatar_url || userState.avatar_url === '/assets/avatarIcon.png' ? (
              <div
                className='dynamic-avatar-bg'
                onClick={() => startEditingAvatar('avatar_url')}
                data-tip
                data-for='avatarTip'
              >
                <div className='dynamic-avatar-text'>
                  {userState.username
                    ? userState.username
                        .split(' ')
                        .map((word: string[]) => word[0])
                        .join('')
                        .slice(0, 2)
                    : 'gg'}
                </div>
              </div>
            ) : (
              <img
                className='gang-avatar'
                src={userState.avatar_url}
                alt='my-avatar'
                onClick={() => startEditingAvatar('avatar_url')}
                data-tip
                data-for='avatarTip'
              ></img>
            )}
          </div>
          <div className='gradient-bar'></div>
          {/* DISPLAY NAME */}
          <div className='gang-container'>
            <div className='gang-about-text'>name</div>
            <input
              onChange={(event) => {
                setnameText(event.target.value);
                sethasUnsavedChanges(true);
              }}
              value={aboutText ? aboutText : ''}
              type='text'
              className='input-box'
              placeholder={
                userState.about && userState.about !== null && userState.about !== '' ? userState.about : 'blank'
              }
            ></input>
          </div>
          <div className='gradient-bar'></div>
          {/* ABOUT */}
          <div className='gang-container'>
            <div className='gang-about-text'>about</div>
            <input
              onChange={(event) => {
                setaboutText(event.target.value);
                sethasUnsavedChanges(true);
              }}
              value={aboutText ? aboutText : ''}
              type='text'
              className='input-box'
              placeholder={
                userState.about && userState.about !== null && userState.about !== '' ? userState.about : 'blank'
              }
            ></input>
          </div>
          <div className='gradient-bar'></div>
          {/* END ABOUT */}
          {/* CHAT PLATFROM */}
          <div className='gang-container'>
            <div className='gang-about-text'>chat platform</div>
            <div className='gender-container'>
              <div
                className={`gender-box ${chatPlatform === 1 ? 'box-selected' : ''}`}
                onClick={() => {
                  changeSelectedPlatform(1);
                }}
              >
                <img className='gender-icon' src={'/assets/discord-logo-small.png'} alt='discord selector'></img>
              </div>
              <div
                className={`gender-box ${chatPlatform === 2 ? 'box-selected' : ''}`}
                onClick={() => {
                  changeSelectedPlatform(2);
                }}
              >
                <img className='gender-icon' src={'/assets/psn-logo-small.png'} alt='psn selector'></img>
              </div>
              <div
                className={`gender-box ${chatPlatform === 3 ? 'box-selected' : ''}`}
                onClick={() => {
                  changeSelectedPlatform(3);
                }}
              >
                <img className='gender-icon' src={'/assets/xbox-logo-small.png'} alt='xbox selector'></img>
              </div>
            </div>
          </div>
          <div className='gradient-bar'></div>
          {/* END CHAT PLATFROM */}
          {/* GAME PLATFROM */}
          <div className='gang-container'>
            <div className='gang-about-text'>primary game</div>
            <div className='gender-container'>
              <div
                className={`gender-box ${game === 1 ? 'box-selected' : ''}`}
                onClick={() => {
                  changeSelectedGame(1);
                }}
              >
                <img
                  className='gender-icon'
                  src={'https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png'}
                  alt='rust selector'
                ></img>
              </div>
              <div
                className={`gender-box ${game === 2 ? 'box-selected' : ''}`}
                onClick={() => {
                  changeSelectedGame(2);
                }}
              >
                <img
                  className='gender-icon'
                  src={
                    'https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png'
                  }
                  alt='rocket league selector'
                ></img>
              </div>
            </div>
          </div>
          <div className='gradient-bar'></div>
          {/* END GAME PLATFROM */}
          {/* IS PUBLIC */}
          <div className='gang-container'>
            <div className='gang-about-text'>is public</div>
            <input
              checked={isPublic}
              onChange={() => {
                setisPublic(!isPublic);
                sethasUnsavedChanges(true);
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
          {/* END IS PUBLIC */}
          {/* START SAVE BOX */}
          <div className='save-box'>
            <button className='save-button' disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
              save
            </button>
          </div>
          {/* END SAVE BOX */}
        </div>
      </div>
    </div>
  );
}
