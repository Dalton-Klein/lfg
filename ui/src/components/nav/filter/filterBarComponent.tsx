import "./filterBarComponent.scss";
import "primeicons/primeicons.css";
import FilterComponent from "./filterComponent";

export default function FilterBarComponent() {
  const availabilityOptions = {
    1: "none",
    2: "some",
    3: "a lot",
    4: "all day",
  };
  return (
    <div className="filter-bar">
      <i className="pi pi-filter"></i>
      <FilterComponent title="sort by" options={availabilityOptions}></FilterComponent>
      <FilterComponent title="hours played" options={availabilityOptions}></FilterComponent>
      <FilterComponent title="availability" options={availabilityOptions}></FilterComponent>
      <FilterComponent title="age" options={availabilityOptions}></FilterComponent>
      <FilterComponent title="language" options={availabilityOptions}></FilterComponent>
      <FilterComponent title="region" options={availabilityOptions}></FilterComponent>
      <i className="pi pi-times-circle clear-button"></i>
    </div>
  );
}
