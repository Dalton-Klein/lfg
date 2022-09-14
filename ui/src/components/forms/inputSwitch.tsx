import './inputSwitch.scss';

export default function CustomInputSwitch(props: any) {
	return (
		<>
			<input
				checked={props.isToggled}
				onChange={() => props.onToggle()}
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
