import './gangTile.scss';
import 'primeicons/primeicons.css';
import { useEffect, useState } from 'react';
import ExpandedProfile from '../modal/expandedProfileComponent';
import { useLocation, useNavigate } from 'react-router-dom';

export default function GangTile(props: any) {
  const navigate = useNavigate();
  const locationPath: string = useLocation().pathname;
  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  const [platformImgLink, setplatformImgLink] = useState<string>('');
  const first5Members = props.members.slice(0, 5);
  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };

  useEffect(() => {
    switch (props.game_platform_id) {
      case 1:
        setplatformImgLink(
          'https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png'
        );
        break;
      case 2:
        setplatformImgLink(
          'https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png'
        );
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={() => {
        navigate(`/gang/${props.id}`);
      }}
      className='gang-card-master'
    >
      {/* Conditionally render hamburger modal */}
      {expandedProfileVis ? (
        <ExpandedProfile
          toggleExpandedProfile={toggleExpandedProfile}
          userInfo={props}
          refreshTiles={props.refreshTiles}
          showConnectForm={true}
          isProfileComplete={props.isProfileComplete}
          isConnected={false}
          game={locationPath === '/lfg-rust' ? 'rust' : 'rocket-league'}
        />
      ) : (
        <></>
      )}
      <div className='gang-card'>
        {/* main details */}
        <div className='top-bar'>
          <div className='main-details'>
            <div className='image-column'>
              {props.avatar_url === '' || props.avatar_url === '/assets/avatarIcon.png' ? (
                <div
                  className='dynamic-avatar-border'
                  onClick={() => {
                    toggleExpandedProfile();
                  }}
                >
                  <div className='dynamic-avatar-text-med'>
                    {props.name
                      .split(' ')
                      .map((word: string[]) => word[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                </div>
              ) : (
                <img
                  className='card-photo'
                  onClick={() => {}}
                  src={props.avatar_url}
                  alt={`${props.name}'s avatar`}
                />
              )}
            </div>
            <div className='gang-info'>
              <div className='gang-name'>{props.name}</div>
              <div className='gang-role-text'>{props.role_name}</div>
            </div>
          </div>
          <img className='gang-game-image' src={platformImgLink} alt={`game this team supports`} />
        </div>
        <div className='gang-about-container'>
          <div>{props.about}</div>
        </div>
        <div className='gang-roster-container'>
          {first5Members.map((member: any) => (
            <div className='list-member-photo' key={member.id}>
              <img className='member-photo' onClick={() => {}} src={member.avatar_url} alt={`member avatar`} />
            </div>
          ))}
          <div className='number-of-members'>{props.members.length} members</div>
        </div>
        <div className='gang-footer'>
          <div className='footer-platform-box' data-tip data-for='commPlatformTip'>
            {props.chat_platform_id === 1 ? (
              <img
                className='footer-platform-image'
                src='/assets/discord-logo-small.png'
                alt={`${props.username} discord`}
              />
            ) : (
              <></>
            )}
            {props.chat_platform_id === 2 ? (
              <img className='footer-platform-image' src='/assets/psn-logo-small.png' alt={`${props.username} psn`} />
            ) : (
              <></>
            )}
            {props.chat_platform_id === 3 ? (
              <img className='footer-platform-image' src='/assets/xbox-logo-small.png' alt={`${props.username} xbox`} />
            ) : (
              <></>
            )}
          </div>
          <div>
            <div className='privacy-text'>{props.is_public ? 'public gang' : 'private gang'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
