import React, { useEffect, useState } from "react";
import {
  attemptPublishRustProfile,
  getRustPlayerTiles,
  getRocketLeagueTiles,
  getLFMGangTiles,
  getBattleBitTiles,
  attemptPublishRocketLeagueProfile,
  attemptPublishBattleBitProfile,
} from "../../utils/rest";
import FooterComponent from "../nav/footerComponent";
import FilterBarComponent from "../nav/filter/filterBarComponent";
import PlayerTile from "../tiles/playerTile";
import "./discoverPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { findUnionForObjectArrays, generateRange } from "../../utils/helperFunctions";
import { resetFilterPreferences } from "../../store/userPreferencesSlice";
import { useLocation } from "react-router-dom";
import BannerAlt from "../nav/banner-alt";
import GangTile from "../tiles/gangTile";

export default function DiscoverPage() {
  const locationPath: string = useLocation().pathname;
  const lfgORlfm = locationPath.slice(0, 4);
  const [discoverTitle, setdiscoverTitle] = useState<string>("");
  const [discoverButtonText, setdiscoverButtonText] = useState<string>("");
  const [discoverLinkUrl, setdiscoverLinkUrl] = useState<string>("");
  const [tilesFeed, settilesFeed] = useState(<li></li>);
  const [tilesFromDB, setTilesFromDB] = useState<any>([]);
  const [isProfileComplete, setisProfileComplete] = useState<boolean>(false);
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const userState = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  useEffect(() => {
    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  //Used to fetch tiles only after profile completeness is decided
  useEffect(() => {
    fetchTilesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileComplete]);

  //Used to render initial tiles, unfiltered
  useEffect(() => {
    turnDataIntoTiles(tilesFromDB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tilesFromDB]);

  //Used to re-render tiles on filter or unfilter
  useEffect(() => {
    updateTilesFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesState.discoverFilters]);

  const initializePage = () => {
    determineTitles();
    if (userState.id && userState.id > 0) {
      checkIfProfileComplete();
    } else {
      fetchTilesData();
    }
    dispatch(resetFilterPreferences());
  };

  const determineTitles = () => {
    // ***NEW GAME EDIT
    switch (locationPath) {
      case "/lfg-rust":
        setdiscoverTitle("find rust players");
        setdiscoverButtonText("my rust profile");
        setdiscoverLinkUrl("/rust-profile");
        break;
      case "/lfg-rocket-league":
        setdiscoverTitle("find rocket league players");
        setdiscoverButtonText("my rl profile");
        setdiscoverLinkUrl("/rocket-league-profile");
        break;
      case "/lfm-rust":
        setdiscoverTitle("find rust gangs");
        setdiscoverButtonText("my rust profile");
        setdiscoverLinkUrl("/rust-profile");
        break;
      case "/lfm-rocket-league":
        setdiscoverTitle("find rocket league gangs");
        setdiscoverButtonText("my rl profile");
        setdiscoverLinkUrl("/rocket-league-profile");
        break;
      case "/lfg-battle-bit":
        setdiscoverTitle("find battle bit players");
        setdiscoverButtonText("my battle bit profile");
        setdiscoverLinkUrl("/battle-bit-profile");
        break;
      case "/lfm-battle-bit":
        setdiscoverTitle("find battle bit gangs");
        setdiscoverButtonText("my battle bit profile");
        setdiscoverLinkUrl("/battle-bit-profile");
        break;
    }
  };
  const fetchTilesData = async () => {
    let tiles: any = [];
    switch (locationPath) {
      case "/lfg-rust":
        tiles = await getRustPlayerTiles(userState.id && userState.id > 0 ? userState.id : 0, "nothing");
        break;
      case "/lfg-rocket-league":
        tiles = await getRocketLeagueTiles(userState.id && userState.id > 0 ? userState.id : 0, "nothing");
        break;
      case "/lfm-rust":
        tiles = await getLFMGangTiles(userState.id && userState.id > 0 ? userState.id : 0, 1, "nothing");
        tiles.forEach((tile) => {
          tile.role_name = "";
        });
        break;
      case "/lfm-rocket-league":
        tiles = await getLFMGangTiles(userState.id && userState.id > 0 ? userState.id : 0, 2, "nothing");
        break;
      case "/lfg-battle-bit":
        tiles = await getBattleBitTiles(userState.id && userState.id > 0 ? userState.id : 0, "nothing");
        break;
      case "/lfm-battle-bit":
        tiles = await getLFMGangTiles(userState.id && userState.id > 0 ? userState.id : 0, 2, "nothing");
        break;
    }
    setTilesFromDB(tiles);
  };

  const checkIfProfileComplete = async () => {
    // ***NEW GAME EDIT
    let isCompleteResult;
    switch (locationPath) {
      case "/lfg-rust":
        isCompleteResult = await attemptPublishRustProfile(userState.id, "nothing");
        break;
      case "/lfg-rocket-league":
        isCompleteResult = await attemptPublishRocketLeagueProfile(userState.id, "nothing");
        break;
      case "/lfm-rust":
        isCompleteResult = await attemptPublishRustProfile(userState.id, "nothing");
        break;
      case "/lfm-rocket-league":
        isCompleteResult = await attemptPublishRocketLeagueProfile(userState.id, "nothing");
        break;
      case "/lfg-battle-bit":
        isCompleteResult = await attemptPublishBattleBitProfile(userState.id, "nothing");
        break;
      case "/lfm-battle-bit":
        isCompleteResult = await attemptPublishBattleBitProfile(userState.id, "nothing");
        break;
    }
    setisProfileComplete(isCompleteResult.status === "success" ? true : false);
    fetchTilesData();
  };

  const turnDataIntoTiles = (tileData: any) => {
    if (lfgORlfm === "/lfg") {
      settilesFeed(
        tileData.map((tile: any) => (
          <li className="player-card" style={{ listStyleType: "none" }} key={tile.id}>
            <PlayerTile {...tile} isProfileComplete={isProfileComplete} refreshTiles={fetchTilesData}></PlayerTile>
          </li>
        ))
      );
    } else {
      settilesFeed(
        tileData.map((tile: any) => (
          <li className="gang-card" style={{ listStyleType: "none" }} key={tile.id}>
            <GangTile {...tile} refreshTiles={fetchTilesData}></GangTile>
          </li>
        ))
      );
    }
  };

  const updateTilesFeed = () => {
    let filteredData: any;
    let rocketLeaguePlaylistResult: any = [];
    let rocketLeagueRankResult: any = [];
    let ageResult = [];
    let hoursResult = [];
    let availabilityResult = [];
    let languageResult = [];
    let regionResult = [];
    //Filter by RL Playlist
    if (locationPath === "/lfg-rocket-league" && preferencesState.discoverFilters.playlist[0]) {
      const playlistKey: any = {
        1: "casual",
        2: "ranked 2s",
        3: "ranked 3s",
      };
      let acceptedPlaylists: number[] = [];
      preferencesState.discoverFilters.playlist.forEach((availabiltyObj: any) => {
        acceptedPlaylists.push(availabiltyObj.label);
      });
      rocketLeaguePlaylistResult = tilesFromDB.filter((tile: any) => {
        return acceptedPlaylists.includes(playlistKey[tile.rocket_league_playlist]);
      });
    } else rocketLeaguePlaylistResult = tilesFromDB;
    //Filter by RL Rank
    if (locationPath === "/lfg-rocket-league" && preferencesState.discoverFilters.rank[0]) {
      const rankKey: any = {
        1: "rocket league bronze rank",
        2: "rocket league silver rank",
        3: "rocket league gold rank",
        4: "rocket league paltinum rank",
        5: "rocket league diamond rank",
        6: "rocket league champ rank",
        7: "rocket league grand champ rank",
      };
      let acceptedRanks: any = [];
      preferencesState.discoverFilters.rank.forEach((availabiltyObj: any) => {
        acceptedRanks.push(availabiltyObj);
      });
      rocketLeagueRankResult = tilesFromDB.filter((tile: any) => {
        return acceptedRanks.includes(rankKey[tile.rocket_league_rank]);
      });
    } else rocketLeagueRankResult = tilesFromDB;
    //Filter by age
    if (preferencesState.discoverFilters.age[0]) {
      let acceptedAges: number[] = [];
      preferencesState.discoverFilters.age.forEach((filterRange: any) => {
        const rangeArray = generateRange(filterRange.value[0], filterRange.value[1]);
        rangeArray.forEach((ageValue: number) => {
          acceptedAges.push(ageValue);
        });
      });
      ageResult = tilesFromDB.filter((tile: any) => acceptedAges.includes(tile.age));
    } else ageResult = tilesFromDB;
    //Filter by hours played
    if (preferencesState.discoverFilters.hours[0]) {
      let acceptedHours: number[] = [];
      preferencesState.discoverFilters.hours.forEach((filterRange: any) => {
        const rangeArray = generateRange(filterRange.value[0], filterRange.value[1]);
        rangeArray.forEach((hoursValue: number) => {
          acceptedHours.push(hoursValue);
        });
      });
      hoursResult = tilesFromDB.filter((tile: any) => acceptedHours.includes(tile.hours));
    } else hoursResult = tilesFromDB;
    //Filter by availability
    if (preferencesState.discoverFilters.availability[0]) {
      let acceptedAvailability: string[] = [];
      preferencesState.discoverFilters.availability.forEach((availabiltyObj: any) => {
        acceptedAvailability.push(availabiltyObj.label);
      });
      availabilityResult = tilesFromDB.filter((tile: any) => {
        const weekdayResult = acceptedAvailability.includes(
          locationPath === "/lfg-rust" ? tile.rust_weekdays : tile.rocket_league_weekends
        );
        const weekendResult = acceptedAvailability.includes(
          locationPath === "/lfg-rust" ? tile.rust_weekends : tile.rocket_league_weekdays
        );
        if (weekdayResult || weekendResult) return tile;
        return false;
      });
    } else availabilityResult = tilesFromDB;
    //Filter by language
    if (preferencesState.discoverFilters.language[0]) {
      let acceptedLanguages: string[] = [];
      preferencesState.discoverFilters.language.forEach((languageObj: any) => {
        acceptedLanguages.push(languageObj.label);
      });
      // eslint-disable-next-line
      languageResult = tilesFromDB.filter((tile: any) => {
        let foundOverlap = false;
        acceptedLanguages.forEach((filterLanguage) => {
          if (filterLanguage === tile.languages) foundOverlap = true;
        });
        if (foundOverlap) return tile;
      });
    } else languageResult = tilesFromDB;
    //Filter by region
    if (preferencesState.discoverFilters.region[0]) {
      let acceptedRegion: string[] = [];
      preferencesState.discoverFilters.region.forEach((regionObj: any) => {
        acceptedRegion.push(regionObj.label);
      });
      regionResult = tilesFromDB.filter((tile: any) => acceptedRegion.includes(tile.region_name));
    } else regionResult = tilesFromDB;
    //Stack filter results and find union
    const resultsArray: any = [];
    resultsArray.push(rocketLeaguePlaylistResult);
    resultsArray.push(rocketLeagueRankResult);
    resultsArray.push(ageResult);
    resultsArray.push(hoursResult);
    resultsArray.push(availabilityResult);
    resultsArray.push(languageResult);
    resultsArray.push(regionResult);
    if (resultsArray.length) filteredData = findUnionForObjectArrays(resultsArray);
    // if (!filteredData) filteredData = tilesFromDB;
    //Sort Start
    if (filteredData && filteredData.length) {
      if (preferencesState.discoverFilters.sort) {
        switch (preferencesState.discoverFilters.sort.value) {
          case 1:
            filteredData = filteredData.sort((a: any, b: any) => {
              return new Date(a.last_seen).getTime() - new Date(b.last_seen).getTime();
            });
            break;
          case 2:
            filteredData = filteredData.sort((a: any, b: any) => {
              return new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime();
            });
            break;
          case 3:
            filteredData = filteredData.sort((a: any, b: any) => {
              return a.hours - b.hours;
            });
            break;
          case 4:
            filteredData = filteredData.sort((a: any, b: any) => {
              return b.hours - a.hours;
            });
            break;
          case 5:
            filteredData = filteredData.sort((a: any, b: any) => {
              return a.age - b.age;
            });
            break;
          case 6:
            filteredData = filteredData.sort((a: any, b: any) => {
              return b.age - a.age;
            });
            break;

          default:
            break;
        }
      }
    }
    turnDataIntoTiles(filteredData ? filteredData : []);
    //Sort End
  };

  const clearAllFiltersAndSorting = () => {
    turnDataIntoTiles(tilesFromDB);
    dispatch(resetFilterPreferences());
  };

  return (
    <div>
      <BannerAlt title={discoverTitle} buttonText={discoverButtonText} buttonLink={discoverLinkUrl}></BannerAlt>
      <FilterBarComponent clearFiltersMethod={clearAllFiltersAndSorting}></FilterBarComponent>
      <div className="feed">{tilesFeed}</div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
