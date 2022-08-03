import React, { useEffect, useState } from "react";
import { getRustTiles } from "../../utils/rest";
import HeaderComponent from "../nav/headerComponent";
import FilterBarComponent from "../nav/filter/filterBarComponent";
import PlayerTile from "../tiles/playerTile";
import "./discoverPage.scss";

export default function DiscoverPage() {
  let tilesFeed: React.ReactNode = <li></li>;
  const [tilesFromDB, setTilesFromDB] = useState([]);

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    const tiles = await getRustTiles(1, "blank");
    tiles.forEach((tile: any) => {
      tile.hours_played = Math.floor(Math.random() * 13000);
    });
    setTilesFromDB(tiles);
  };

  tilesFeed = tilesFromDB.map((tile: any) => (
    <li style={{ listStyleType: "none" }} key={tile.id}>
      <PlayerTile {...tile}></PlayerTile>
    </li>
  ));

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <article className="header-rust" style={{ backgroundImage: "url(/assets/rust-tile-image.png)" }}>
        <div>find rust players</div>
      </article>
      <FilterBarComponent></FilterBarComponent>
      <div className="feed">{tilesFeed}</div>
    </div>
  );
}
