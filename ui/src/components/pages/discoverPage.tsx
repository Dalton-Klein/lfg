import React, { useEffect, useState } from "react";
import { getRustTiles } from "../../utils/rest";
import HeaderComponent from "../nav/headerComponent";
import FilterBarComponent from "../nav/filter/filterBarComponent";
import PlayerTile from "../tiles/playerTile";
import "./discoverPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { generateRange } from "../../utils/helperFunctions";
import { resetPreferences } from "../../store/userPreferencesSlice";

export default function DiscoverPage() {
  const [tilesFeed, setTilesFeed] = useState(<li></li>);
  const [tilesFromDB, setTilesFromDB] = useState<any>([]);
  const preferencesState = useSelector((state: RootState) => state.preferences);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchTilesData();
    dispatch(resetPreferences());
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
    //Filter by age
    if (preferencesState.discoverFilters.age[0]) {
      let acceptedAges: number[] = [];
      preferencesState.discoverFilters.age.forEach((filterRange: any) => {
        const rangeArray = generateRange(filterRange.value[0], filterRange.value[1]);
        rangeArray.forEach((ageValue: number) => {
          acceptedAges.push(ageValue);
        });
      });
      filteredData = tilesFromDB.filter((tile: any) => acceptedAges.includes(tile.age));
    }
    //Filter by hours played
    if (preferencesState.discoverFilters.hours[0]) {
      let acceptedHours: number[] = [];
      preferencesState.discoverFilters.hours.forEach((filterRange: any) => {
        const rangeArray = generateRange(filterRange.value[0], filterRange.value[1]);
        rangeArray.forEach((hoursValue: number) => {
          acceptedHours.push(hoursValue);
        });
      });
      filteredData = tilesFromDB.filter((tile: any) => acceptedHours.includes(tile.hours_played));
    }
    //Filter by availability
    if (preferencesState.discoverFilters.availability[0]) {
      let acceptedAvailability: string[] = [];
      preferencesState.discoverFilters.availability.forEach((availabiltyObj: any) => {
        acceptedAvailability.push(availabiltyObj.label);
      });
      filteredData = tilesFromDB.filter((tile: any) => acceptedAvailability.includes(tile.weekdays || tile.weekends));
    }
    //Filter by language
    if (preferencesState.discoverFilters.language[0]) {
      let acceptedLanguages: string[] = [];
      preferencesState.discoverFilters.language.forEach((languageObj: any) => {
        acceptedLanguages.push(languageObj.label);
      });
      filteredData = tilesFromDB.filter((tile: any) => {
        let foundOverlap = false;
        acceptedLanguages.forEach((filterLanguage) => {
          tile.languages.forEach((tileLanguage: string) => {
            if (filterLanguage === tileLanguage) foundOverlap = true;
          });
        });
        if (foundOverlap) return tile;
      });
    }
    //Filter by region
    if (preferencesState.discoverFilters.region[0]) {
      let acceptedRegion: string[] = [];
      preferencesState.discoverFilters.region.forEach((regionObj: any) => {
        acceptedRegion.push(regionObj.label);
      });
      filteredData = tilesFromDB.filter((tile: any) => acceptedRegion.includes(tile.region_name));
    }
    if (!filteredData) filteredData = tilesFromDB;

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
