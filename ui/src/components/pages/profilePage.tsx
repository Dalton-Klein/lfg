import React, { useEffect, useState } from "react";
import "./profilePage.scss";
import ConnectionTile from "../tiles/connectionTile";
import HeaderComponent from "../nav/headerComponent";
import ProfileGeneral from "../tiles/myProfileTiles/profileGeneral";
import ProfileNavComponent from "../nav/profile/profileNavComponent";
import { getConnectionsForUser } from "../../utils/rest";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setPreferences } from "../../store/userPreferencesSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [selection, setSelection] = useState(1);
  const [connectionsResult, setconnectionsResult] = useState([]);
  const preferencesState = useSelector((state: RootState) => state.preferences);

  useEffect(() => {
    fetchConnections();
    setSelection(preferencesState.lastProfileMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    changeSelection(preferencesState.lastProfileMenu);
  }, [preferencesState.lastProfileMenu]);

  const fetchConnections = async () => {
    const connectionResults = await getConnectionsForUser(1, "blank");
    setconnectionsResult(connectionResults);
  };

  const changeSelection = (value: number) => {
    setSelection(value);
    dispatch(
      setPreferences({
        conversationsOrChat: preferencesState.conversationsOrChat,
        currentChatId: preferencesState.currentChatId,
        currentChatItemId: preferencesState.currentChatItemId,
        currentChatOtherUser: {
          id: preferencesState.currentChatOtherUser.id,
          avatarUrl: preferencesState.currentChatOtherUser.avatarUrl,
          username: preferencesState.currentChatOtherUser.username,
        },
        messages: preferencesState.messages,
        lastProfileMenu: value,
      })
    );
    // localStorage.setItem("lastProfileMenu", JSON.stringify(value));
  };

  let connections: React.ReactNode = <li></li>;

  connections = connectionsResult.map((tile: any) => (
    <li className="connection-list-item" style={{ listStyleType: "none" }} key={tile.id}>
      <ConnectionTile {...tile}></ConnectionTile>
    </li>
  ));

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <ProfileNavComponent
        selection={selection}
        selectionChanged={(value) => {
          changeSelection(value);
        }}
      ></ProfileNavComponent>
      {/* MENU 1 */}
      {selection === 1 ? (
        <div className="my-profile-container">
          <ProfileGeneral></ProfileGeneral>
        </div>
      ) : (
        <></>
      )}
      {/* MENU 2 */}
      {selection === 2 ? (
        <div className="my-profile-container">
          <ProfileGeneral></ProfileGeneral>
        </div>
      ) : (
        <></>
      )}
      {/* MENU 3 */}
      {selection === 3 ? <div className="my-profile-container">{connections}</div> : <></>}
    </div>
  );
}
