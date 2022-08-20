import "./selectComponent.scss";
import "primeicons/primeicons.css";
import makeAnimated from "react-select/animated";
import { useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setPreferences } from "../../store/userPreferencesSlice";

const animatedComponents = makeAnimated();
interface props {
  title: string;
  options: any;
  multi: boolean;
}

const style = {
  control: (base: any) => ({
    ...base,
    // This line disables the default blue border in react-select
    boxShadow: "none",
  }),
};

export default function SelectComponent(props: props) {
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<any>();

  const selectionChange = (options: any, filterAction: any) => {
    // setSelected(options);
    // const filterName = filterAction.name;
    // dispatch(
    //   setPreferences({
    //     ...preferencesState,
    //     discoverFilters: { ...preferencesState.discoverFilters, [filterName]: options },
    //   })
    // );
  };
  return (
    <div className="profile-select-container">
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
        />
      )}
    </div>
  );
}