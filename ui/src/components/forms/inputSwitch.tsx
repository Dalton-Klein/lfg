import './inputSwitch.scss';

export default function CustomInputSwitch(props: any) {
	const handleChange = () => {
		if (typeof props.onToggle === 'function') {
			props.onToggle();
		}
	};

	return (
		<>
			<input
				checked={props.isToggled}
				onChange={() => {
					handleChange();
					console.log('wtf minicomp');
				}}
				className="react-switch-checkbox"
				id={`react-switch-new`}
				type="checkbox"
			/>
			<label className="react-switch-label" htmlFor={`react-switch-new`}>
				<span className={`react-switch-button`} />
			</label>
		</>
	);
}
