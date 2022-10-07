import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './privacyPolicyPage.scss';

export default function PrivacyPolicyPage() {
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			{/* Privacy Policy Container */}
			<div className="pp-title">privacy policy</div>
			<div className="pp-content-container">
				<div className="pp-paragraph">eventually, a summary will go here!</div>
				<div className="pp-sub-title">what do we collect</div>
				<div className="pp-paragraph">welcome to gangs, the most efficient place to find your gamer gang.</div>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
