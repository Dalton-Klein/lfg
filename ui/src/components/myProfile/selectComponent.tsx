import './selectComponent.scss';
import 'primeicons/primeicons.css';
import makeAnimated from 'react-select/animated';
import { useEffect, useState } from 'react';
import Select from 'react-select';

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
    boxShadow: 'none',
  }),
  menu: (base: any) => ({
		...base,
		// This line disables the default blue border in react-select
		backgroundColor: '#1c1c1e',
		borderRadius: 'calc(8px + 0.25vw)',
  }),
  menuList: (base: any) => ({
		...base,
		// This line disables the default blue border in react-select
		backgroundColor: 'transparent',
  }),
  option: (base: any) => ({
		...base,
    borderRadius: 'calc(8px + 0.25vw)',
    backgroundColor: ' #1c1c1e',
    color: '#ffffff',
    fontSize: 'calc(16px + 0.25vw)',
    opacity: 1,
    "&:hover": {
      backgroundColor: '#232026',
    },
  }),
};

const SelectComponent = (props: props) => {
  const [selected, setSelected] = useState<any>({ label: '' });

  useEffect(() => {
    props.publicMethods.current = {
      detectChangeFromParent,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectChangeFromParent = (event: any) => {
    setSelected(event);
  };

  const selectionChange = (option: any) => {
    props.setSelection(option);
  };

  return (
    <div className=' container'>
      {props.multi ? (
        <Select
          name={props.title}
          value={selected || { value: props.title, label: props.title }}
          components={animatedComponents}
          options={props.options}
          className='react-select-container'
          classNamePrefix='react-select'
          isClearable={false}
          isSearchable={false}
          styles={style}
          onChange={selectionChange}
          isMulti
					menuPortalTarget={document.body}
					menuPosition={'fixed'}
					menuShouldBlockScroll={true}
        />
      ) : (
        <Select
          name={props.title}
          components={animatedComponents}
          options={props.options}
          className='react-select-container'
          classNamePrefix='react-select'
          value={selected || { value: props.title, label: props.title }}
          isClearable={false}
          isSearchable={false}
          styles={style}
          onChange={selectionChange}
					menuPortalTarget={document.body}
					menuPosition={'fixed'}
					menuShouldBlockScroll={true}
        />
      )}
    </div>
  );
};

export default SelectComponent;
