import './profileGeneral.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { RootState } from '../../store/store';
import { updateGameSpecificInfoField, attemptPublishRocketLeagueProfile } from '../../utils/rest';
import { Toast } from 'primereact/toast';
import { updateUserThunk } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import ProfileWidgetsContainer from './profileWidgetsContainer';

type Props = {
  locationPath: string;
  changeBanner: any;
};

export default function ProfileRocketLeague(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: '' });
  const profileWidgetsRef: any = useRef();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isProfileDiscoverable, setIsProfileDiscoverable] = useState<boolean>(false);
  const [rocketLeaguePlaylist, setrocketLeaguePlaylist] = useState<number>(0);
  const [rocketLeagueRank, setrocketLeagueRank] = useState<number>(0);
  const [rocket_leagueHoursText, setrocketLeagueHoursText] = useState<number>(0);
  const [availabilityTooltipString, setavailabilityTooltipString] = useState<string>('');
  const [rocketLeagueWeekday, setrocketLeagueWeekday] = useState<string>('');
  const [rocketLeagueWeekend, setrocketLeagueWeekend] = useState<string>('');

  useEffect(() => {
    props.changeBanner('https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userData.email && userData.email !== '') {
      profileWidgetsRef.current.updateWidgets();
      setrocketLeaguePlaylist(
        userData.rocket_league_preffered_playlist === null ? '' : userData.rocket_league_preffered_playlist
      );
      setrocketLeagueRank(userData.rocket_league_rank === null ? '' : userData.rocket_league_rank);
      setrocketLeagueHoursText(userData.rocket_league_hours === null ? '' : userData.rocket_league_hours);
      setrocketLeagueWeekday(userData.rocket_league_weekdays === null ? '' : userData.rocket_league_weekdays);
      setrocketLeagueWeekend(userData.rocket_league_weekends === null ? '' : userData.rocket_league_weekends);
      setIsProfileDiscoverable(userData.rocket_league_is_published);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const changeRocketLeaguePlaylist = (selection: number) => {
    if (rocketLeaguePlaylist !== selection) setHasUnsavedChanges(true);
    setrocketLeaguePlaylist(selection);
  };

  const changeRocketLeagueRank = (selection: number) => {
    if (rocketLeagueRank !== selection) setHasUnsavedChanges(true);
    setrocketLeagueRank(selection);
  };

  const changeRocketLeagueWeekday = (selection: string) => {
    if (rocketLeagueWeekday !== selection) setHasUnsavedChanges(true);
    setrocketLeagueWeekday(selection);
  };

  const changeRocketLeagueWeekend = (selection: string) => {
    if (rocketLeagueWeekend !== selection) setHasUnsavedChanges(true);
    setrocketLeagueWeekend(selection);
  };

  // BEGIN SAVE
  //NON-MODAL SAVE LOGIC
  const saveChanges = async () => {
    const playlistValues: any = {
      none: 1,
      some: 2,
      'a lot': 3,
      'all day': 4,
    };
    const rankValues: any = {
      none: 1,
      some: 2,
      'a lot': 3,
      'all day': 4,
    };
    const availabilityValues: any = {
      none: 1,
      some: 2,
      'a lot': 3,
      'all day': 4,
    };
    const rocketLeagueWeekdayIdValue = availabilityValues[rocketLeagueWeekday];
    const rocketLeagueWeekendIdValue = availabilityValues[rocketLeagueWeekend];
    if (rocket_leagueHoursText > 0 && userData.rocket_league_hours !== rocket_leagueHoursText) {
      await updateGameSpecificInfoField(userData.id, 'user_rocket_league_infos', 'hours', rocket_leagueHoursText);
    }
    if (rocketLeagueWeekday !== '' && userData.rocket_league_weekdays !== rocketLeagueWeekday) {
      await updateGameSpecificInfoField(
        userData.id,
        'user_rocket_league_infos',
        'weekdays',
        rocketLeagueWeekdayIdValue
      );
    }
    if (rocketLeagueWeekend !== '' && userData.rocket_league_weekends !== rocketLeagueWeekend) {
      await updateGameSpecificInfoField(
        userData.id,
        'user_rocket_league_infos',
        'weekends',
        rocketLeagueWeekendIdValue
      );
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
    profileWidgetsRef.current.updateWidgets();
  };
  // END SAVE

  // BEGIN PUBLISH
  const tryPublishRocketLeagueProfile = async () => {
    if (!isProfileDiscoverable) {
      //execute http req
      const result = await attemptPublishRocketLeagueProfile(userData.id, '');
      if (result.status === 'success') {
        await updateGameSpecificInfoField(userData.id, 'user_rocket_league_infos', 'is_published', true);
        setIsProfileDiscoverable(true);
        toast.current.clear();
        toast.current.show({
          severity: 'success',
          summary: 'rocket_league profile published!',
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
      await updateGameSpecificInfoField(userData.id, 'user_rocket_league_infos', 'is_published', false);
      setIsProfileDiscoverable(false);
      toast.current.clear();
      toast.current.show({
        severity: 'success',
        summary: 'rocket_league profile now hidden!',
        detail: ``,
        sticky: false,
      });
    }
    // After all data is comitted to db, get fresh copy of user object to update state
    dispatch(updateUserThunk(userData.id));
  };
  // END PUBLISH

  return (
    <div>
      <Toast ref={toast} />
      {/* START ROCKET LEAGUE SETTINGS */}
      <div
        className='submenu-container'
        style={{ display: props.locationPath === '/rocket-league-profile' ? 'inline-block' : 'none' }}
      >
        <div className='back-container'>
          <button
            className='back-button'
            onClick={() => {
              navigate('/general-profile');
            }}
          >
            &nbsp; back to general profile
          </button>
        </div>
        {/* START Profile Widgets */}
        <ProfileWidgetsContainer ref={profileWidgetsRef}></ProfileWidgetsContainer>
        <div className='gradient-bar'></div>
        {/* END Profile Widgets */}
        <div className='banner-container'>
          <div className='prof-banner-detail-text' data-tip data-for='publishTip'>
            publish rocket league profile
          </div>
          <input
            checked={isProfileDiscoverable}
            onChange={() => {
              tryPublishRocketLeagueProfile();
            }}
            className='react-switch-checkbox'
            id={`react-switch-rocket_league-published`}
            type='checkbox'
          />
          <label className='react-switch-label' htmlFor={`react-switch-rocket_league-published`}>
            <span className={`react-switch-button`} />
          </label>
        </div>
        <div className='gradient-bar'></div>
        {/* ROCKET LEAGUE PLAYLIST */}
        <div className='banner-container'>
          <div className='prof-banner-detail-text'>playlist</div>
          <div className='gender-container'>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'none' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeaguePlaylist(4);
              }}
              onMouseEnter={() => setavailabilityTooltipString('any non-ranked playlist')}
              data-tip
              data-for='availabilityTip'
            >
              casual
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'none' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeaguePlaylist(1);
              }}
              onMouseEnter={() => setavailabilityTooltipString('ranked 1v1')}
              data-tip
              data-for='availabilityTip'
            >
              1's
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'some' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeaguePlaylist(2);
              }}
              onMouseEnter={() => setavailabilityTooltipString('ranked 2v2')}
              data-tip
              data-for='availabilityTip'
            >
              2's
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'a lot' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeaguePlaylist(4);
              }}
              onMouseEnter={() => setavailabilityTooltipString('ranked 3v3')}
              data-tip
              data-for='availabilityTip'
            >
              3's
            </div>
          </div>
        </div>
        <div className='gradient-bar'></div>
        {/* END ROCKET LEAGUE PLAYLIST */}
        {/* ROCKET LEAGUE RANK */}
        <div className='banner-container'>
          <div className='prof-banner-detail-text'>rank</div>
          <div className='gender-container'>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'none' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueRank(1);
              }}
              onMouseEnter={() => setavailabilityTooltipString('bronze')}
              data-tip
              data-for='availabilityTip'
            >
              <img src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-bronze-transp_fw3ar3.png'></img>
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'none' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueRank(2);
              }}
              onMouseEnter={() => setavailabilityTooltipString('silver')}
              data-tip
              data-for='availabilityTip'
            >
              <img src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-silver-transp_ovmdbx.png'></img>
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'some' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueRank(3);
              }}
              onMouseEnter={() => setavailabilityTooltipString('gold')}
              data-tip
              data-for='availabilityTip'
            >
              <img src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-gold-transp_vwr4dz.png'></img>
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'a lot' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueRank(4);
              }}
              onMouseEnter={() => setavailabilityTooltipString('plat')}
              data-tip
              data-for='availabilityTip'
            >
              <img src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-plat-transp_rgbpdw.png'></img>
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'a lot' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueRank(5);
              }}
              onMouseEnter={() => setavailabilityTooltipString('diamond')}
              data-tip
              data-for='availabilityTip'
            >
              <img src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-diamond-transp_j0vmlx.png'></img>
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'a lot' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueRank(6);
              }}
              onMouseEnter={() => setavailabilityTooltipString('champ')}
              data-tip
              data-for='availabilityTip'
            >
              <img src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-champ-transp_v2xt1q.png'></img>
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'a lot' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueRank(7);
              }}
              onMouseEnter={() => setavailabilityTooltipString('grand champ')}
              data-tip
              data-for='availabilityTip'
            >
              <img src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-grand-champ-transp_jflaeq.png'></img>
            </div>
          </div>
        </div>
        <div className='gradient-bar'></div>
        {/* END ROCKET LEAGUE RANK */}
        {/* ROCKET LEAGUE HOURS */}
        <div className='banner-container'>
          <div className='prof-banner-detail-text'>hours played</div>
          <input
            onChange={(event) => {
              setrocketLeagueHoursText(parseInt(event.target.value));
              setHasUnsavedChanges(true);
            }}
            value={rocket_leagueHoursText ? rocket_leagueHoursText : ''}
            type='number'
            className='input-box'
            placeholder={userData.hours && userData.hours !== null && userData.hours !== '' ? userData.hours : 'none'}
          ></input>
        </div>
        <div className='gradient-bar'></div>
        {/* END ROCKET LEAGUE HOURS */}
        {/* Availability- Weekdays */}
        <div className='banner-container'>
          <div className='prof-banner-detail-text'>weekday availabilty</div>
          <div className='gender-container'>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'none' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekday('none');
              }}
              onMouseEnter={() => setavailabilityTooltipString('0 hours')}
              data-tip
              data-for='availabilityTip'
            >
              none
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'some' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekday('some');
              }}
              onMouseEnter={() => setavailabilityTooltipString('0-2 hours')}
              data-tip
              data-for='availabilityTip'
            >
              some
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'a lot' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekday('a lot');
              }}
              onMouseEnter={() => setavailabilityTooltipString('2-6 hours')}
              data-tip
              data-for='availabilityTip'
            >
              a lot
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekday === 'all day' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekday('all day');
              }}
              onMouseEnter={() => setavailabilityTooltipString('6+ hours')}
              data-tip
              data-for='availabilityTip'
            >
              all day
            </div>
          </div>
        </div>
        <div className='gradient-bar'></div>
        {/* END Availability- Weekdays */}
        {/* Availability- Weekends */}
        <div className='banner-container'>
          <div className='prof-banner-detail-text'>weekend availability</div>
          <div className='gender-container'>
            <div
              className={`gender-box ${rocketLeagueWeekend === 'none' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekend('none');
              }}
              onMouseEnter={() => setavailabilityTooltipString('0 hours')}
              data-tip
              data-for='availabilityTip'
            >
              none
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekend === 'some' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekend('some');
              }}
              onMouseEnter={() => setavailabilityTooltipString('0-2 hours')}
              data-tip
              data-for='availabilityTip'
            >
              some
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekend === 'a lot' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekend('a lot');
              }}
              onMouseEnter={() => setavailabilityTooltipString('2-6 hours')}
              data-tip
              data-for='availabilityTip'
            >
              a lot
            </div>
            <div
              className={`gender-box ${rocketLeagueWeekend === 'all day' ? 'box-selected' : ''}`}
              onClick={() => {
                changeRocketLeagueWeekend('all day');
              }}
              onMouseEnter={() => setavailabilityTooltipString('6+ hours')}
              data-tip
              data-for='availabilityTip'
            >
              all day
            </div>
          </div>
        </div>
        <div className='gradient-bar'></div>
        {/* END Availability- Weekends */}
        {/* START SAVE BOX */}
        <div className='save-box'>
          <button className='save-button' disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
            save
          </button>
        </div>
        {/* END SAVE BOX */}
      </div>
      {/* END ROCKET LEAGUE SETTINGS */}
      <ReactTooltip id='availabilityTip' place='top' effect='solid'>
        {availabilityTooltipString}
      </ReactTooltip>
    </div>
  );
}
