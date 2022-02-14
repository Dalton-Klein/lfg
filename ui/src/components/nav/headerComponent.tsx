import '../../styling/header.scss';
import ProfileInlayComponet from './profileInlayComponet';

export default function HeaderComponent() {
	return (
		<div className="header-container">
			<h2>codelounge</h2>
			<ProfileInlayComponet />
		</div>
	);
}
