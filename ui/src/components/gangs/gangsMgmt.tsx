import { avatarFormIn, avatarFormOut } from '../../utils/animations';
import './gangsMgmt.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRocketLeagueTiles, getRustGangTiles, updateGangInfoField, createNewGang } from '../../utils/rest';
import GangTile from '../tiles/gangTile';
import BannerTitle from '../nav/banner-title';
import { Toast } from 'primereact/toast';
import ReactTooltip from 'react-tooltip';

type Props = {
  gangId: number;
};

export default function GangsMgmt(props: Props) {
  const locationPath: string = useLocation().pathname;
  const hiddenFileInput: any = React.useRef(null);
  const userState = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: '' });
  const navigate = useNavigate();

  const [hasCompletedForm, sethasCompletedForm] = useState<boolean>(false);
  const [hasUnsavedChanges, sethasUnsavedChanges] = useState<boolean>(false);
  const [isUploadFormShown, setisUploadFormShown] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>({ name: '' } as File);
  const [gangAvatarUrl, setgangAvatarUrl] = useState<string>('');
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

  useEffect(() => {
    checkIfFormComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, chatPlatform]);

  //Used to render initial tiles, unfiltered
  useEffect(() => {
    turnDataIntoTiles(tilesFromDB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tilesFromDB]);

  const checkIfFormComplete = () => {
    if (nameText && nameText.length >= 3 && aboutText && aboutText.length >= 3 && chatPlatform > 0 && game > 0) {
      sethasCompletedForm(true);
    } else {
      sethasCompletedForm(false);
    }
    console.log('changing platform: ', chatPlatform, '  ', game, nameText, aboutText);
    return;
  };
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
    const createResult = await createNewGang(userState.id, {
      name: nameText,
      avatar_url: gangAvatarUrl,
      about: aboutText,
      chat_platform_id: chatPlatform,
      game_platform_id: game,
      is_public: isPublic,
    });
    console.log('create res, ', createResult);
    if (createResult) {
      navigate(`/dashboard`);
    }
  };
  //END NON-MODAL SAVE LOGIC

  return (
    <div>
      <Toast ref={toast} />
      <BannerTitle
        title={locationPath === '/create-gang' ? 'create gang' : 'gang management'}
        imageLink={''}
      ></BannerTitle>
      <div className='gang-mgmt-master'>
        <div className='gang-mgmt-container'>
          {/* AVATAR PHTO */}
          <div className='gang-container-top'>
            {locationPath === '/create-gang' ? (
              <div
                className='dynamic-avatar-bg'
                onClick={() => startEditingAvatar('avatar_url')}
                data-tip
                data-for='avatarTip'
              >
                <div className='dynamic-avatar-text'>{'gg'}</div>
              </div>
            ) : (
              <img
                className='gang-avatar'
                src={'/assets/avatarIcon.png'}
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
            <div className='gang-about-text' data-tip data-for='gang-name-tooltip'>
              gang name
            </div>
            <input
              onChange={(event) => {
                setnameText(event.target.value);
                sethasUnsavedChanges(true);
                checkIfFormComplete();
              }}
              value={nameText ? nameText : ''}
              type='text'
              className='input-box'
              placeholder={locationPath == '/create-gang' ? 'name...' : 'name...'}
            ></input>
          </div>
          <div className='gradient-bar'></div>
          {/* ABOUT */}
          <div className='gang-container'>
            <div className='gang-about-text' data-tip data-for='gang-name-tooltip'>
              about
            </div>
            <input
              onChange={(event) => {
                setaboutText(event.target.value);
                sethasUnsavedChanges(true);
                checkIfFormComplete();
              }}
              value={aboutText ? aboutText : ''}
              type='text'
              className='input-box'
              placeholder={locationPath == 'create-gang' ? 'about...' : 'about...'}
            ></input>
          </div>
          <div className='gradient-bar'></div>
          {/* END ABOUT */}
          {/* CHAT PLATFROM */}
          <div className='gang-container'>
            <div className='gang-about-text' data-tip data-for='must-select-tooltip'>
              chat platform
            </div>
            <div className='gender-container'>
              <div
                className={`gender-box ${chatPlatform === 1 ? 'box-selected' : ''}`}
                onClick={() => {
                  changeSelectedPlatform(1);
                }}
              >
                <img className='gender-icon' src={'/assets/logoWhiteSmall.png'} alt='gangs selector'></img>
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
            <div className='gang-about-text' data-tip data-for='must-select-tooltip'>
              primary game
            </div>
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
            <button
              className='save-button'
              disabled={locationPath === '/create-gang' ? !hasCompletedForm : !hasUnsavedChanges}
              onClick={() => saveChanges()}
            >
              {locationPath === '/create-gang' ? 'create' : 'save'}
            </button>
          </div>
          {/* END SAVE BOX */}
        </div>
      </div>
      <ReactTooltip id='gang-name-tooltip' place='right' effect='solid'>
        must be 3 or more characters
      </ReactTooltip>
      <ReactTooltip id='must-select-tooltip' place='right' effect='solid'>
        must make a selection
      </ReactTooltip>
    </div>
  );
}
