import "./filterBarComponent.scss";
import "primeicons/primeicons.css";
import FilterComponent from "./filterComponent";
import { useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function FilterBarComponent(props: any) {
  const sortOptions = [
    { label: "last seen ☝️", value: 1, id: "1" },
    { label: "last seen 👇", value: 2, id: "2" },
    { label: "hours ☝️", value: 3, id: "3" },
    { label: "hours 👇", value: 4, id: "4" },
    { label: "age ☝️", value: 5, id: "5" },
    { label: "age 👇", value: 6, id: "6" },
  ];
  const hoursOptions = [
    { label: "0-249", value: [0, 249], id: "1" },
    { label: "250-499", value: [250, 499], id: "2" },
    { label: "500-749", value: [500, 749], id: "3" },
    { label: "750-999", value: [750, 999], id: "4" },
    { label: "1k-1.5k", value: [1000, 1499], id: "5" },
    { label: "1.5k-2k", value: [1500, 1999], id: "6" },
    { label: "2k-3k", value: [2000, 2999], id: "7" },
    { label: "3k+", value: [3000, 50000], id: "8" },
  ];
  const ageOptions = [
    { label: "0-11", value: [0, 11], id: "1" },
    { label: "12-14", value: [12, 14], id: "2" },
    { label: "15-17", value: [15, 17], id: "3" },
    { label: "18-22", value: [18, 22], id: "4" },
    { label: "23-29", value: [22, 29], id: "5" },
    { label: "30+", value: [30, 100], id: "6" },
  ];
  const availabilityOptions = [
    { label: "none", type: "availability", value: 1, id: "1" },
    { label: "some", type: "availability", value: 2, id: "2" },
    { label: "a lot", type: "availability", value: 3, id: "3" },
    { label: "all day", type: "availability", value: 4, id: "4" },
  ];
  const languageOptions = [
    { label: "english", type: "language", value: 1, id: "1" },
    { label: "mandarin chinese", type: "language", value: 2, id: "2" },
    { label: "spanish", type: "language", value: 3, id: "3" },
    { label: "hindi", type: "language", value: 4, id: "4" },
    { label: "russian", type: "language", value: 5, id: "5" },
    { label: "japanese", type: "language", value: 6, id: "6" },
    { label: "german", type: "language", value: 7, id: "7" },
    { label: "french", type: "language", value: 8, id: "8" },
  ];
  const regionOptions = [
    { label: "north america west", type: "region", value: 1, id: "1" },
    { label: "north america east", type: "region", value: 2, id: "2" },
    { label: "europe", type: "region", value: 3, id: "3" },
    { label: "south america", type: "region", value: 4, id: "4" },
    { label: "asia", type: "region", value: 5, id: "5" },
    { label: "oceania", type: "region", value: 6, id: "6" },
    { label: "africa", type: "region", value: 7, id: "7" },
  ];

  const clearFilters = () => {
    props.clearFiltersMethod();
  };

  return (
    <Accordion activeIndex={1}>
      <AccordionTab header="sort / filter">
        <div className="filter-bar">
          <i className="pi pi-filter"></i>
          <FilterComponent title="sort" options={sortOptions} multi={false}></FilterComponent>
          <FilterComponent title="hours" options={hoursOptions} multi={true}></FilterComponent>
          <FilterComponent title="age" options={ageOptions} multi={true}></FilterComponent>
          <FilterComponent title="availability" options={availabilityOptions} multi={true}></FilterComponent>
          <FilterComponent title="language" options={languageOptions} multi={true}></FilterComponent>
          <FilterComponent title="region" options={regionOptions} multi={true}></FilterComponent>
          <i className="pi pi-times-circle clear-button" onClick={clearFilters}></i>
        </div>
      </AccordionTab>
    </Accordion>
  );
}
