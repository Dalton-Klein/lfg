import { useEffect, useState } from 'react';
import { attemptPublishRustProfile, getRustTiles } from '../../utils/rest';
import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import FilterBarComponent from '../nav/filter/filterBarComponent';
import PlayerTile from '../tiles/playerTile';
import './discoverPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { findUnionForObjectArrays, generateRange } from '../../utils/helperFunctions';
import { resetFilterPreferences } from '../../store/userPreferencesSlice';
import BannerTitle from '../nav/banner-title';

export default function DiscoverPage() {
	const [tilesFeed, setTilesFeed] = useState(<li></li>);
	const [tilesFromDB, setTilesFromDB] = useState<any>([]);
	const [isProfileComplete, setisProfileComplete] = useState<boolean>(false);
	const preferencesState = useSelector((state: RootState) => state.preferences);
	const userState = useSelector((state: RootState) => state.user.user);

	const dispatch = useDispatch();

	useEffect(() => {
		if (userState.id && userState.id > 0) {
			checkIfProfileComplete();
		} else {
			fetchTilesData();
		}
		dispatch(resetFilterPreferences());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	const fetchTilesData = async () => {
		const tiles = await getRustTiles(userState.id && userState.id > 0 ? userState.id : 0, 'nothing');
		setTilesFromDB(tiles);
	};

	const checkIfProfileComplete = async () => {
		const isCompleteResult = await attemptPublishRustProfile(userState.id, 'nothing');
		setisProfileComplete(isCompleteResult.status === 'success' ? true : false);
	};

	const turnDataIntoTiles = (tileData: any) => {
		setTilesFeed(
			tileData.map((tile: any) => (
				<li style={{ listStyleType: 'none' }} key={tile.id}>
					<PlayerTile {...tile} isProfileComplete={isProfileComplete} refreshTiles={fetchTilesData}></PlayerTile>
				</li>
			))
		);
	};

	const updateTilesFeed = () => {
		let filteredData: any;
		let ageResult = [];
		let hoursResult = [];
		let availabilityResult = [];
		let languageResult = [];
		let regionResult = [];

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
			availabilityResult = tilesFromDB.filter((tile: any) =>
				acceptedAvailability.includes(tile.rust_weekdays || tile.rust_weekends)
			);
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
		const resultsArray = [];
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
			<HeaderComponent></HeaderComponent>
			<BannerTitle
				title={'find rust players'}
				imageLink={'https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png'}
			></BannerTitle>
			<FilterBarComponent clearFiltersMethod={clearAllFiltersAndSorting}></FilterBarComponent>
			<div className='feed'>{tilesFeed}</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
