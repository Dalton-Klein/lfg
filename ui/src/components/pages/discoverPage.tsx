import React, { useEffect, useState } from "react";
import { getRustTiles } from "../../utils/rest";
import HeaderComponent from "../nav/headerComponent";
import PlayerTile from "../tiles/playerTile";
import "./discoverPage.scss";

export default function DiscoverPage() {
  let tilesFeed: React.ReactNode = <li></li>;
  const [tilesFromDB, setTilesFromDB] = useState([]);

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    setTilesFromDB(await getRustTiles(1, "blank"));
  };

  tilesFeed = tilesFromDB.map((tile: any) => (
    <li style={{ listStyleType: "none" }} key={tile.id}>
      <PlayerTile {...tile}></PlayerTile>
    </li>
  ));

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="feed">{tilesFeed}</div>
    </div>
  );
}
