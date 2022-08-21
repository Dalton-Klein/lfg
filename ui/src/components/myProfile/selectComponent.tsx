import "./selectComponent.scss";
import "primeicons/primeicons.css";
import makeAnimated from "react-select/animated";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const animatedComponents = makeAnimated();
interface props {
  title: string;
  options: any;
  multi: boolean;
  setSelection: any;
  selection: any;
  publicMethods: any;
}

const style = {
  control: (base: any) => ({
    ...base,
    // This line disables the default blue border in react-select
    boxShadow: "none",
  }),
};

const SelectComponent = (props: props) => {
  const [selected, setSelected] = useState<any>();

  useEffect(() => {
    props.publicMethods.current = {
      detectChangeFromParent,
    };
  }, []);

  const detectChangeFromParent = (event: any) => {
    console.log("detected from parent", event);
    setSelected(event);
  };

  const selectionChange = (option: any) => {
    props.setSelection(option);
  };

  return (
    <div className=" container">
      {props.multi ? (
        <Select
          name={props.title}
          value={selected || { value: props.title, label: props.title }}
          components={animatedComponents}
          options={props.options}
          className="react-select-container"
          classNamePrefix="react-select"
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
          value={selected || { value: props.title, label: props.title }}
          isClearable={false}
          isSearchable={false}
          styles={style}
          onChange={selectionChange}
        />
      )}
    </div>
  );
};

export default SelectComponent;
