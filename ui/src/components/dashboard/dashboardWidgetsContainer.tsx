import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import ProfileWidget from '../myProfile/profileWidget';
import './dashboardWidgetsContainer.scss';

const DashboardWidgetsContainer = () => {
  const userData = useSelector((state: RootState) => state.user.user);

  const [connectionCount, setconnectionCount] = useState<number>(0);
  const [messageCount, setmessageCount] = useState<number>(0);
  const [gangCount, setgangCount] = useState<number>(0);
  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userData.email && userData.email !== '') {
      const formattedSenderConnectionCount = parseInt(userData.connection_count_sender);
      const formattedAcceptorConnectionCount = parseInt(userData.connection_count_acceptor);
      let formattedConnectionCount;
      if (formattedSenderConnectionCount >= 0 && formattedAcceptorConnectionCount >= 0) {
        formattedConnectionCount = formattedSenderConnectionCount + formattedAcceptorConnectionCount;
      } else {
        formattedConnectionCount = 0;
      }
      setconnectionCount(formattedConnectionCount);
      const formatedGangCount = (parseInt(userData.gang_count) && parseInt(userData.gang_count) > 0) ? parseInt(userData.gang_count) : 0
      setgangCount(formatedGangCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <div className='widgets-container'>
      <ProfileWidget value={connectionCount} label={'connections'}></ProfileWidget>
      <ProfileWidget value={gangCount} label={'gangs'}></ProfileWidget>
    </div>
  );
};
export default DashboardWidgetsContainer;
