import FooterComponent from "../nav/footerComponent";
import HeaderComponent from "../nav/headerComponent";
import "./gangPage.scss";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getGangActivity } from "../../utils/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function GangPage() {
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const [gangInfo, setgangInfo] = useState<any>({});
  const [chatList, setchatList] = useState<any>([]);
  const [currentChannel, setcurrentChannel] = useState<string>("");

  const [first5Members, setfirst5Members] = useState<any>([]);
  const [platformImgLink, setplatformImgLink] = useState<string>("");
  const [expandedProfileVis, setExpandedProfileVis] = useState<boolean>(false);
  const toggleExpandedProfile = () => {
    setExpandedProfileVis(!expandedProfileVis);
  };

  useEffect(() => {
    const locationOfLastSlash = locationPath.lastIndexOf("/");
    const extractedGangId = locationPath.substring(locationOfLastSlash + 1);

    loadGangPage(parseInt(extractedGangId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("gang: ", gangInfo);
    if (gangInfo.chats) {
      turnChatsIntoTiles();
      if (gangInfo.basicInfo?.members) {
        setfirst5Members(gangInfo.basicInfo.members.slice(0, 5));
      }
      switch (gangInfo.basicInfo?.game_platform_id) {
        case 1:
          setplatformImgLink(
            "https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png"
          );
          break;
        case 2:
          setplatformImgLink(
            "https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png"
          );
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gangInfo]);

  const loadGangPage = async (id: number) => {
    const result = await getGangActivity(id, userState.id, "");
    setgangInfo(result);
  };

  const channelButtonPressed = (id: number) => {
    console.log("joining channel: ", id);
  };

  const turnChatsIntoTiles = () => {
    if (gangInfo.role?.role_id) {
      //If in gang, show list of channels
      setchatList(
        gangInfo.chats.map((tile: any) => (
          <button
            key={tile.id}
            className="alt-button"
            onClick={() => {
              channelButtonPressed(tile.id);
            }}
          >
            {tile.name}
          </button>
        ))
      );
    } else {
      //If not in gang, show join button
      setchatList(
        <button className="alt-button">join {gangInfo.basicInfo?.name ? gangInfo.basicInfo?.name : ""}</button>
      );
    }
  };

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="master-gang-contents">
        <div className="top-bar">
          <div className="main-details">
            <div className="image-column">
              {gangInfo.basicInfo?.avatar_url === "" || gangInfo.basicInfo?.avatar_url === "/assets/avatarIcon.png" ? (
                <div
                  className="dynamic-avatar-border"
                  onClick={() => {
                    toggleExpandedProfile();
                  }}
                >
                  <div className="dynamic-avatar-text-med">
                    {gangInfo.basicInfo?.name
                      .split(" ")
                      .map((word: string[]) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                </div>
              ) : (
                <img
                  className="card-photo"
                  onClick={() => {}}
                  src={gangInfo.basicInfo?.avatar_url}
                  alt={`${gangInfo.basicInfo?.name}'s avatar`}
                />
              )}
            </div>
            <div className="gang-info">
              <div className="gang-name">{gangInfo.basicInfo?.name ? gangInfo.basicInfo.name : ""}</div>
              <div className="gang-role-text">{gangInfo.role?.role_name ? gangInfo.role?.role_name : ""}</div>
            </div>
          </div>
          <img className="gang-game-image" src={platformImgLink} alt={`game this team supports`} />
        </div>
        <div className="about-box">{gangInfo.basicInfo?.about ? gangInfo.basicInfo.about : ""}</div>
        <div className="channel-specific-contents" style={{ display: currentChannel == "" ? "flex" : "none" }}>
          <div className="gang-roster-container">
            {first5Members.map((member: any) => (
              <div className="list-member-photo" key={member.id}>
                <img className="member-photo" onClick={() => {}} src={member.avatar_url} alt={`member avatar`} />
              </div>
            ))}
            <div className="number-of-members">
              {gangInfo.basicInfo?.members?.length ? gangInfo.basicInfo?.members?.length : ""} members
            </div>
          </div>
          <div className="chat-list">{chatList}</div>
        </div>
        <div className="channel-specific-contents"></div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
