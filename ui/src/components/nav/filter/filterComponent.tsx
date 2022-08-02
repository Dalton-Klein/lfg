import "./filterComponent.scss";
import "primeicons/primeicons.css";
import makeAnimated from "react-select/animated";
import { useState } from "react";
import Select from "react-select";

const animatedComponents = makeAnimated();
interface props {
  title: string;
  options: any;
}

const style = {
  control: (base: any) => ({
    ...base,
    // This line disables the default blue border in react-select
    boxShadow: "none",
  }),
};

export default function FilterComponent(props: props) {
  const [selection, setSelection] = useState("");

  const selectionChange = (option: any) => {
    setSelection(option.id);
    validateForm();
  };

  const validateForm = () => {};

  return (
    <div className="filter-container">
      {/* <div>{props.title}</div>
      <i className="pi pi-chevron-down"></i> */}
      <Select
        name={props.title}
        components={animatedComponents}
        options={props.options}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={props.title}
        isClearable={false}
        isSearchable={false}
        styles={style}
        onChange={selectionChange}
      />
    </div>
  );
}
