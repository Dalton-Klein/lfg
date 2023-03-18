import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './gangsPage.scss';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GangsList from '../gangs/gangsList';
import GangsMgmt from '../gangs/gangsMgmt';

export default function GangsPage() {
  const locationPath: string = useLocation().pathname;

  const [gangId, setgangId] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div>WOWW</div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
