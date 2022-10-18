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
	sortOptions,
} from '../../../utils/selectOptions';
import { useRef } from 'react';

export default function FilterBarComponent(props: any) {
	const sortRef: any = useRef();
	const hoursRef: any = useRef();
	const ageRef: any = useRef();
	const availabilityRef: any = useRef();
	const languageRef: any = useRef();
	const regionRef: any = useRef();

	const clearFilters = () => {
		props.clearFiltersMethod();
		sortRef.current!.clearFilter();
		hoursRef.current!.clearFilter();
		ageRef.current!.clearFilter();
		availabilityRef.current!.clearFilter();
		languageRef.current!.clearFilter();
		regionRef.current!.clearFilter();
	};

	return (
		<Accordion activeIndex={1}>
			<AccordionTab header="press for filters">
				<div className="filter-bar">
					<i className="pi pi-filter"></i>
					<FilterComponent title="sort" options={sortOptions} multi={false} innerRef={sortRef}></FilterComponent>
					<FilterComponent title="hours" options={hoursOptions} multi={true} innerRef={hoursRef}></FilterComponent>
					<FilterComponent title="age" options={ageOptions} multi={true} innerRef={ageRef}></FilterComponent>
					<FilterComponent
						title="availability"
						options={availabilityOptions}
						multi={true}
						innerRef={availabilityRef}
					></FilterComponent>
					<FilterComponent
						title="language"
						options={languageOptions}
						multi={true}
						innerRef={languageRef}
					></FilterComponent>
					<FilterComponent title="region" options={regionOptions} multi={true} innerRef={regionRef}></FilterComponent>
					<div className="clear-button" onClick={clearFilters}>
						clear all
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	);
}
