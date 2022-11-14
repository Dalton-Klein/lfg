import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './lfgSplashPage.scss';
import DaddyTile from '../tiles/daddyTile';
import React, { useEffect } from 'react';

export default function LFGSplashPage() {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className='tile-container'>
        <div className='discover-tiles'>
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG='/lfg-rust'
            routerLinkLFM='/lfm-rust'
            image='https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png'
            title='lfg rust'
            buttonTextLFG='lfg'
            buttonTextLFM='lfm'
          ></DaddyTile>
          <DaddyTile
            has2Buttons={true}
            routerLinkLFG='/lfg-rocket-league'
            routerLinkLFM='/lfm-rocket-league'
            image='https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg'
            title='lfg rocket league'
            buttonTextLFG='lfg'
            buttonTextLFM='lfm'
          ></DaddyTile>
        </div>
      </div>

      <FooterComponent></FooterComponent>
    </div>
  );
}
