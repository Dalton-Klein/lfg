import "./filterComponent.scss";
import "primeicons/primeicons.css";
import makeAnimated from "react-select/animated";
import { useImperativeHandle, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setPreferences } from "../../../store/userPreferencesSlice";

const animatedComponents = makeAnimated();
interface props {
  title: string;
  options: any;
  multi: boolean;
  innerRef: any;
}

const style = {
  control: (base: any) => ({
    ...base,
    // This line disables the default blue border in react-select
    boxShadow: "none",
  }),
  menu: (base: any) => ({
    ...base,
    // This line disables the default blue border in react-select
    backgroundColor: "#1c1c1e",
    borderRadius: "calc(8px + 0.25vw)",
  }),
  menuList: (base: any) => ({
    ...base,
    // This line disables the default blue border in react-select
    backgroundColor: "transparent",
  }),
  option: (base: any) => ({
    ...base,
    borderRadius: "calc(8px + 0.25vw)",
    backgroundColor: " #1c1c1e",
    color: "#ffffff",
    fontSize: "calc(16px + 0.25vw)",
    opacity: 1,
    "&:hover": {
      backgroundColor: "#232026",
    },
  }),
};

export default function FilterComponent(props: props) {
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<any>();

  useImperativeHandle(props.innerRef, () => ({
    clearFilter: clearFilter,
  }));

  const clearFilter = () => {
    selectionChange([], {}, true);
  };

  const selectionChange = (options: any, filterAction: any, isClearing = false) => {
    setSelected(options);
    let formattedOptions: any = [];
    //For options that are pictures, use this if block
    if (filterAction.name === "rank") {
      options.forEach((option: any) => {
        formattedOptions.push(option.label.props.alt);
      });
    }
    //Update preferences state with filter objects
    if (isClearing) {
      dispatch(
        setPreferences({
          ...preferencesState,
          discoverFilters: {
            sort: "",
            age: [],
            hours: [],
            availability: [],
            language: [],
            region: [],
            playlist: [],
            rank: [],
          },
        })
      );
    } else {
      const filterName = filterAction.name;
      dispatch(
        setPreferences({
          ...preferencesState,
          discoverFilters: {
            ...preferencesState.discoverFilters,
            [filterName]: formattedOptions.length ? formattedOptions : options,
          },
        })
      );
    }
  };

  return (
    <div className="filter-container">
      {props.multi ? (
        <Select
          name={props.title}
          value={selected || ""}
          components={animatedComponents}
          options={props.options}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder={props.title}
          isClearable={false}
          isSearchable={false}
          styles={style}
          onChange={selectionChange}
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          menuShouldBlockScroll={true}
        />
      ) : (
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
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          menuShouldBlockScroll={true}
        />
      )}
    </div>
  );
}
