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

export default function FilterBarComponent(props: any) {
	const clearFilters = () => {
		props.clearFiltersMethod();
	};

	return (
		<Accordion activeIndex={1}>
			<AccordionTab header="press for filters">
				<div className="filter-bar">
					<i className="pi pi-filter"></i>
					<FilterComponent title="sort" options={sortOptions} multi={false}></FilterComponent>
					<FilterComponent title="hours" options={hoursOptions} multi={true}></FilterComponent>
					<FilterComponent title="age" options={ageOptions} multi={true}></FilterComponent>
					<FilterComponent title="availability" options={availabilityOptions} multi={true}></FilterComponent>
					<FilterComponent title="language" options={languageOptions} multi={true}></FilterComponent>
					<FilterComponent title="region" options={regionOptions} multi={true}></FilterComponent>
					<div className="clear-button" onClick={clearFilters}>
						clear all
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	);
}
