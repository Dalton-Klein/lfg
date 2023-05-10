import React, { useEffect, useState } from "react";
import "./profilePage.scss";
import ConnectionTile from "../tiles/connectionTile";
import ProfileGeneral from "../myProfile/profileGeneral";
import { acceptConnectionRequest, acceptGangConnectionRequest, getPendingConnectionsForUser } from "../../utils/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "primereact/resources/primereact.min.css";
import Confetti from "react-confetti";
import Chat from "../myProfile/chat";
import { useLocation, useNavigate } from "react-router-dom";
import BannerTitle from "../nav/banner-title";
import ProfileRust from "../myProfile/profileRust";
import ProfileRocketLeague from "../myProfile/profileRocketLeague";
import ProfileWidgetsContainer from "../myProfile/profileWidgetsContainer";
import AccountSettings from "../myProfile/profileAccountSettings";

export default function ProfilePage({ socketRef }) {
  const navigate = useNavigate();

  // Location Variables
  const locationPath: string = useLocation().pathname;
  const gameProfilePaths: string[] = ["/rust-profile", "/rocket-league-profile"];
  const requestPaths: string[] = ["/incoming-requests", "/outgoing-requests", "/blocked"];
  const menuTitleKey: any = {
    "/general-profile": "general profile",
    "/messaging": "direct messaging",
    "/incoming-requests": "incoming requests",
    "/outgoing-requests": "outgoing requests",
    "/blocked": "blocked",
    "/account-settings": "account settings",
    "/rust-profile": "rust profile",
    "/rocket-league-profile": "rocket league profile",
  };
  const menuTitle = menuTitleKey[locationPath];

  const [bannerImageUrl, setbannerImageUrl] = useState<string>(
    "https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"
  );
  const [chatBox, setchatBox] = useState<any>(<></>);
  const [outgoingResult, setOutgoingResult] = useState<any>([]);
  const [incomingResult, setincomingResult] = useState<any>([]);
  const [gangIncomingResult, setgangIncomingResult] = useState<any>([]);
  const [blockedResult, setBlockedResult] = useState<any>([]);
  const [isConfetti, setIsConfetti] = useState<any>(false);

  const noResultsDiv = <div className="no-results-box">nothing at the moment!</div>;

  const userData = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);

  useEffect(() => {
    if (userData.id && userData.id > 0) {
      fetchPendingConnections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setChatboxContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesState.currentConvo]);

  const changeBannerImage = (newuRL: string) => {
    setbannerImageUrl(newuRL);
  };

  const setChatboxContents = () => {
    setchatBox(<Chat socketRef={socketRef} convo={preferencesState.currentConvo}></Chat>);
  };

  //BEGIN Fetch Connections
  const fetchPendingConnections = async () => {
    const httpResults = await getPendingConnectionsForUser(userData.id, "blank");
    const formattedIncomingTiles = httpResults.incoming.map((tile: any) => (
      <li className="connection-list-item" style={{ listStyleType: "none" }} key={tile.id}>
        <ConnectionTile
          {...tile}
          type={3}
          callAcceptRequest={(senderId: number, requestId: number) => {
            acceptRequest(senderId, requestId);
          }}
        ></ConnectionTile>
      </li>
    ));
    const formattedOutgoingTiles = httpResults.outgoing.map((tile: any) => (
      <li className="connection-list-item" style={{ listStyleType: "none" }} key={tile.id}>
        <ConnectionTile
          {...tile}
          type={4}
          callAcceptRequest={(senderId: number, requestId: number) => {
            acceptRequest(senderId, requestId);
          }}
        ></ConnectionTile>
      </li>
    ));
    const formattedGangRequestTiles = httpResults.gang.map((tile: any) => (
      <li className="connection-list-item" style={{ listStyleType: "none" }} key={tile.id}>
        <ConnectionTile
          {...tile}
          type={3}
          callAcceptRequest={(gangId: number, requestId: number) => {
            acceptGangRequest(gangId, requestId);
          }}
        ></ConnectionTile>
      </li>
    ));
    setOutgoingResult(formattedOutgoingTiles);
    setincomingResult(formattedIncomingTiles);
    setgangIncomingResult(formattedGangRequestTiles);
    setBlockedResult([]);
  };
  //END Fetch Connections

  //BEGIN Social Actions Logic
  const blastConfetti = async () => {
    setTimeout(function () {
      setIsConfetti(false);
    }, 4000);
  };
  const acceptRequest = async (senderId: number, requestId: number) => {
    const acceptResult = await acceptConnectionRequest(userData.id, senderId, 1, requestId, userData.token);
    if (acceptResult && acceptResult[1] === 1) {
      setIsConfetti(true);
      await blastConfetti();
      fetchPendingConnections();
      //***** TODO ***** call event on vertical nav to refresh list */
      // fetchExistingConnections();
    }
  };
  const acceptGangRequest = async (senderId: number, requestId: number) => {
    /// TODO
    const acceptResult = await acceptGangConnectionRequest(requestId, userData.token);
    if (acceptResult && acceptResult.length) {
      setIsConfetti(true);
      await blastConfetti();
      fetchPendingConnections();
      //***** TODO ***** call event on vertical nav to refresh list */
      // fetchExistingConnections();
    }
  };
  //END Social Actions Logic

  const width = 1920;
  const height = 1080;

  return (
    <div className="profile-page-master">
      {isConfetti ? (
        <Confetti
          numberOfPieces={isConfetti ? 500 : 0}
          recycle={false}
          width={width}
          height={height}
          tweenDuration={1000}
        />
      ) : (
        <></>
      )}
      {/* Title Section */}
      {locationPath === "/messaging" ? <></> : <BannerTitle title={menuTitle} imageLink={bannerImageUrl}></BannerTitle>}

      <div className="my-profile-containers" style={{ display: locationPath !== "/messaging" ? "flex" : "none" }}>
        {/* Conditionally render hamburger modal */}

        <div className="submenu-container">
          {/* START CONDITIONAL BACK BUTTON */}
          <div
            className="back-container"
            style={{ display: gameProfilePaths.includes(locationPath) ? "flex" : "none" }}
          >
            <button
              className="back-button"
              onClick={() => {
                navigate("/general-profile");
              }}
            >
              &nbsp; general profile
            </button>
          </div>
          {/* END CONDITIONAL BACK BUTTON */}
          {/* START Profile Widgets */}
          {!requestPaths.includes(locationPath) ? <ProfileWidgetsContainer></ProfileWidgetsContainer> : <></>}
          {!requestPaths.includes(locationPath) ? <div className="gradient-bar"></div> : <></>}
          {/* END Profile Widgets */}
          {/* Game Profiles (Conditional) */}
          {locationPath === "/rust-profile" ? (
            <ProfileRust locationPath={locationPath} changeBanner={changeBannerImage}></ProfileRust>
          ) : (
            <> </>
          )}
          {locationPath === "/rocket-league-profile" ? (
            <ProfileRocketLeague locationPath={locationPath} changeBanner={changeBannerImage}></ProfileRocketLeague>
          ) : (
            <> </>
          )}
          {locationPath === "/general-profile" ? (
            <ProfileGeneral changeBanner={changeBannerImage}></ProfileGeneral>
          ) : (
            <> </>
          )}
          {locationPath === "/account-settings" ? (
            <AccountSettings changeBanner={changeBannerImage}></AccountSettings>
          ) : (
            <> </>
          )}
          {/* MENU 1- My Prof */}
        </div>
      </div>

      {/* MENU 2- Messaging */}
      {locationPath === "/messaging" ? <div className="messaging-container">{chatBox}</div> : <></>}
      {/* MENU 3- Incoming Connections */}
      {locationPath === "/incoming-requests" ? (
        <div className="connection-container">
          <div className="request-header">connection requests</div>
          {incomingResult.length > 0 ? incomingResult : noResultsDiv}
          <div className="request-header">gang invitations</div>
          {gangIncomingResult.length > 0 ? gangIncomingResult : noResultsDiv}
        </div>
      ) : (
        <></>
      )}
      {/* MENU 4- Outgoing Connections */}
      {locationPath === "/outgoing-requests" ? (
        <div className="connection-container">{outgoingResult.length > 0 ? outgoingResult : noResultsDiv}</div>
      ) : (
        <></>
      )}
      {/* MENU 5- Blocked People */}
      {locationPath === "/blocked" ? (
        <div className="connection-container">{blockedResult.length > 0 ? blockedResult : noResultsDiv}</div>
      ) : (
        <></>
      )}
    </div>
  );
}
