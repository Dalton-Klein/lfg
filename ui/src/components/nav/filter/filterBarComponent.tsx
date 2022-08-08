import "./filterBarComponent.scss";
import "primeicons/primeicons.css";
import FilterComponent from "./filterComponent";
import { useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function FilterBarComponent() {
  const [selectedSortOption, setSelectedSortOption] = useState("mru");

  const sortOptions = [
    { label: "most recent ☝️", value: "mru" },
    { label: "most recent 👇", value: "mrd" },
    { label: "hours ☝️", value: "hu" },
    { label: "hours 👇", value: "hd" },
    { label: "Istanbul", value: "IST" },
    { label: "Paris", value: "PRS" },
  ];
  const hoursOptions = [
    { label: "0-249", value: "1" },
    { label: "250-499", value: "2" },
    { label: "500-749", value: "3" },
    { label: "750-999", value: "4" },
    { label: "1k-1.5k", value: "5" },
    { label: "1.5k-2k", value: "6" },
    { label: "2k-3k", value: "7" },
    { label: "3k+", value: "8" },
  ];
  const ageOptions = [
    { label: "0-11", value: "1" },
    { label: "12-14", value: "2" },
    { label: "15-17", value: "3" },
    { label: "18-22", value: "4" },
    { label: "23-30", value: "5" },
    { label: "30+", value: "6" },
  ];
  const availabilityOptions = [
    { label: "none", value: "1" },
    { label: "some", value: "2" },
    { label: "a lot", value: "3" },
    { label: "all day", value: "4" },
  ];
  const languageOptions = [
    { label: "english", value: "1" },
    { label: "mandarin chinese", value: "2" },
    { label: "spanish", value: "3" },
    { label: "hindi", value: "4" },
    { label: "russian", value: "5" },
    { label: "japanese", value: "6" },
    { label: "german", value: "7" },
    { label: "french", value: "8" },
  ];
  const regionOptions = [
    { label: "north america west", value: "1" },
    { label: "north america east", value: "2" },
    { label: "europe", value: "3" },
    { label: "south america", value: "4" },
    { label: "asia", value: "5" },
    { label: "oceania", value: "6" },
    { label: "africa", value: "7" },
  ];

  return (
    <Accordion activeIndex={1}>
      <AccordionTab header="sort / filter">
        <div className="filter-bar">
          <i className="pi pi-filter"></i>
          <FilterComponent title="sort by" options={sortOptions} multi={false}></FilterComponent>
          <FilterComponent title="hours" options={hoursOptions} multi={true}></FilterComponent>
          <FilterComponent title="age" options={ageOptions} multi={true}></FilterComponent>
          <FilterComponent title="availability" options={availabilityOptions} multi={true}></FilterComponent>
          <FilterComponent title="language" options={languageOptions} multi={true}></FilterComponent>
          <FilterComponent title="region" options={regionOptions} multi={true}></FilterComponent>
          <i className="pi pi-times-circle clear-button"></i>
        </div>
      </AccordionTab>
    </Accordion>
  );
}
