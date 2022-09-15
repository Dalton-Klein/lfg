import { useNavigate } from 'react-router-dom';
import './headerFooterComponents.scss';
import ProfileInlayComponet from './profileInlayComponet';
let logoSource = '/assets/logo-v1.png';
export default function HeaderComponent() {
	const navigate = useNavigate();
	return (
		<div className="master-container">
			<div className="header-container">
				<div className="header-site-title" onClick={() => navigate(`/`)}>
					gangs
				</div>
				<ProfileInlayComponet />
			</div>
			<div className="gradient-bar"></div>
		</div>
	);
}
