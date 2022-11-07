import './filterBarComponent.scss';
import 'primeicons/primeicons.css';
import FilterComponent from './filterComponent';
import { Accordion, AccordionTab } from 'primereact/accordion';
import {
	ageOptions,
	availabilityOptions,
	hoursOptions,
	languageOptions,
	regionOptions,
	rocketLeaguePlaylistOptions,
	sortOptions,
} from '../../../utils/selectOptions';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function FilterBarComponent(props: any) {
	const locationPath: string = useLocation().pathname;

	const sortRef: any = useRef();
	const rocketLeaguePlaylistRef: any = useRef();
	const rocketLeagueRankRef: any = useRef();
	const hoursRef: any = useRef();
	const ageRef: any = useRef();
	const availabilityRef: any = useRef();
	const languageRef: any = useRef();
	const regionRef: any = useRef();

	const clearFilters = () => {
		props.clearFiltersMethod();
		rocketLeaguePlaylistRef.current!.clearFilter();
		rocketLeagueRankRef.current!.clearFilter();
		sortRef.current!.clearFilter();
		hoursRef.current!.clearFilter();
		ageRef.current!.clearFilter();
		availabilityRef.current!.clearFilter();
		languageRef.current!.clearFilter();
		regionRef.current!.clearFilter();
	};

	const rocketLeagueRankOptions: any = [
		{
			value: 1,
			id: 1,
			type: 'rocketLeagueRank',
			label: (
				<img
					src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-bronze-transp_fw3ar3.png'
					alt='rocket league bronze rank'
					style={{ maxHeight: '4.5vh', maxWidth: '4.5vh', minHeight: '4.5vh', minWidth: '4.5vh' }}
				></img>
			),
		},
		{
			value: 2,
			id: 2,
			type: 'rocketLeagueRank',
			label: (
				<img
					src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-silver-transp_ovmdbx.png'
					alt='rocket league silver rank'
					style={{ maxHeight: '4.5vh', maxWidth: '4.5vh', minHeight: '4.5vh', minWidth: '4.5vh' }}
				></img>
			),
		},
		{
			value: 3,
			id: 3,
			type: 'rocketLeagueRank',
			label: (
				<img
					src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-gold-transp_vwr4dz.png'
					alt='rocket league gold rank'
					style={{ maxHeight: '4.5vh', maxWidth: '4.5vh', minHeight: '4.5vh', minWidth: '4.5vh' }}
				></img>
			),
		},
		{
			value: 4,
			id: 4,
			type: 'rocketLeagueRank',
			label: (
				<img
					src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-plat-transp_rgbpdw.png'
					alt='rocket league platinum rank'
					style={{ maxHeight: '4.5vh', maxWidth: '4.5vh', minHeight: '4.5vh', minWidth: '4.5vh' }}
				></img>
			),
		},
		{
			value: 5,
			id: 5,
			type: 'rocketLeagueRank',
			label: (
				<img
					src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-diamond-transp_j0vmlx.png'
					alt='rocket league diamond rank'
					style={{ maxHeight: '4.5vh', maxWidth: '4.5vh', minHeight: '4.5vh', minWidth: '4.5vh' }}
				></img>
			),
		},
		{
			value: 6,
			id: 6,
			type: 'rocketLeagueRank',
			label: (
				<img
					src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-champ-transp_v2xt1q.png'
					alt='rocket league champ rank'
					style={{ maxHeight: '4.5vh', maxWidth: '4.5vh', minHeight: '4.5vh', minWidth: '4.5vh' }}
				></img>
			),
		},
		{
			value: 7,
			id: 7,
			type: 'rocketLeagueRank',
			label: (
				<img
					src='https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-grand-champ-transp_jflaeq.png'
					alt='rocket league grand champ rank'
					style={{ maxHeight: '4.5vh', maxWidth: '4.5vh', minHeight: '4.5vh', minWidth: '4.5vh' }}
				></img>
			),
		},
	];

	return (
		<Accordion activeIndex={1}>
			<AccordionTab header='press for filters'>
				<div className='filter-bar'>
					<i className='pi pi-filter'></i>
					<FilterComponent title='sort' options={sortOptions} multi={false} innerRef={sortRef}></FilterComponent>
					{locationPath === '/lfg-rocket-league' ? (
						<FilterComponent
							title='playlist'
							options={rocketLeaguePlaylistOptions}
							multi={true}
							innerRef={rocketLeaguePlaylistRef}
						></FilterComponent>
					) : (
						<></>
					)}
					{locationPath === '/lfg-rocket-league' ? (
						<FilterComponent
							title='rank'
							options={rocketLeagueRankOptions}
							multi={true}
							innerRef={rocketLeagueRankRef}
						></FilterComponent>
					) : (
						<></>
					)}
					<FilterComponent title='hours' options={hoursOptions} multi={true} innerRef={hoursRef}></FilterComponent>
					<FilterComponent title='age' options={ageOptions} multi={true} innerRef={ageRef}></FilterComponent>
					<FilterComponent
						title='availability'
						options={availabilityOptions}
						multi={true}
						innerRef={availabilityRef}
					></FilterComponent>
					<FilterComponent
						title='language'
						options={languageOptions}
						multi={true}
						innerRef={languageRef}
					></FilterComponent>
					<FilterComponent title='region' options={regionOptions} multi={true} innerRef={regionRef}></FilterComponent>
					<div className='clear-button' onClick={clearFilters}>
						clear all
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	);
}
