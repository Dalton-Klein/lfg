import React, { useEffect, useState } from "react";
import { getRustTiles } from "../../utils/rest";
import HeaderComponent from "../nav/headerComponent";
import FilterBarComponent from "../nav/filter/filterBarComponent";
import PlayerTile from "../tiles/playerTile";
import "./discoverPage.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { generateRange } from "../../utils/helperFunctions";

export default function DiscoverPage() {
  const [tilesFeed, setTilesFeed] = useState(<li></li>);
  const [tilesFromDB, setTilesFromDB] = useState<any>([]);
  const preferencesState = useSelector((state: RootState) => state.preferences);

  useEffect(() => {
    fetchTilesData();
  }, []);

  //Used to render initial tiles, unfiltered
  useEffect(() => {
    turnDataIntoTiles(tilesFromDB);
  }, [tilesFromDB]);

  //Used to re-render tiles on filter or unfilter
  useEffect(() => {
    updateTilesFeed();
  }, [preferencesState.discoverFilters]);

  const fetchTilesData = async () => {
    const tiles = await getRustTiles(1, "blank");
    tiles.forEach((tile: any) => {
      tile.hours_played = Math.floor(Math.random() * 13000);
    });
    setTilesFromDB(tiles);
  };

  const turnDataIntoTiles = (tileData: any) => {
    setTilesFeed(
      tileData.map((tile: any) => (
        <li style={{ listStyleType: "none" }} key={tile.id}>
          <PlayerTile
            {...tile}
            expandRequest={(profile: any) => {
              expandProfile(profile);
            }}
          ></PlayerTile>
        </li>
      ))
    );
  };

  const updateTilesFeed = () => {
    let filteredData;
    if (preferencesState.discoverFilters.age[0]) {
      let acceptedAges: number[] = [];
      preferencesState.discoverFilters.age.forEach((filterRange: any) => {
        const rangeArray = generateRange(filterRange.value[0], filterRange.value[1]);
        rangeArray.forEach((ageValue: number) => {
          acceptedAges.push(ageValue);
        });
      });
      console.log("state: ", preferencesState.discoverFilters.age, "    ages: ", acceptedAges);
      filteredData = tilesFromDB.filter((tile: any) => acceptedAges.includes(tile.age));
    } else if (preferencesState.discoverFilters.hours[0]) {
    } else {
      filteredData = tilesFromDB;
    }
    turnDataIntoTiles(filteredData);
  };

  const expandProfile = (profile: any) => {
    console.log("expand logic here: ", profile);
  };

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
