import React, { useEffect, useState } from "react";
import "./profilePage.scss";
import ConnectionTile from "../tiles/connectionTile";
import HeaderComponent from "../nav/headerComponent";
import ProfileGeneral from "../tiles/myProfileTiles/profileGeneral";
import ProfileNavComponent from "../nav/profile/profileNavComponent";
import { getConnectionsForUser } from "../../utils/rest";

export default function ProfilePage() {
  const [selection, setSelection] = useState(1);
  const [connectionsResult, setconnectionsResult] = useState([]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    const connectionResults = await getConnectionsForUser(1, "blank");
    console.log("res: ", connectionResults);
    setconnectionsResult(connectionResults);
  };
  const changeSelection = (value: number) => {
    setSelection(value);
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
