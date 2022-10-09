import './profileWidget.scss';

export default function ProfileWidget(props: any) {
	return (
		<div className="profile-widget">
			<div className="widget-value">{props.value}</div>
			<div>{props.label}</div>
		</div>
	);
}
