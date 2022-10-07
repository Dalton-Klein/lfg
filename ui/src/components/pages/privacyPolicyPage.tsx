import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './privacyPolicyPage.scss';

export default function PrivacyPolicyPage() {
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className="pp-master-container">
				{/* Privacy Policy Container */}
				<div className="pp-title">privacy policy</div>
				<div className="pp-content-container">
					<div className="pp-paragraph">
						gangs.gg is part of Kultured Dev LLC (Incorporated in MN, USA. EIN - 85-0627436) This privacy policy will
						explain how gangs.gg uses the personal data we collect from you when you use our website.
					</div>
					<div className="pp-sub-title">what do we collect</div>
					<div className="pp-paragraph">
						<li>email</li>
						<li>age</li>
						<li>username / alias</li>
						<li>gender</li>
						<li>profile image</li>
						<li>location - region</li>
						<li>language spoken</li>
						<li>games played</li>
						<li>game-related information - availability, experience</li>
						<li>third-party profiles / usernames - discord, play station network, xbox live</li>
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">how do we collect your data</div>
					<div className="pp-paragraph">
						you directly provide gangs.gg with most of the data we collect. We collect data and process data when you:
						<br />
						<br />
						<li>register an account - personal information </li>
						<li>create your profile - game-related information </li>
						<br />
						<br />
						gangs.gg may also receive your data indirectly from the following sources:
						<br />
						<br />
						<li>Google Oauth - email, given name, and other general info</li>
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">how do we use your data</div>
					<div className="pp-paragraph">
						gangs.gg collects your data so that we can:
						<br />
						<br />
						<li>display useful information for other users to determine compatibility</li>
						<li>send transactional emails to enhance the functionality of gangs.gg</li>
						<li>send marketing emails to alert you of website updates or company news</li>
						<li>match you with other like-minded users</li>
						<li>connect you with other users and facilitate communication</li>
						<li>understand how you use gangs.gg to iterate and improve your user experience.</li>
					</div>
				</div>

				<div className="pp-content-container">
					<div className="pp-sub-title">how to contact us</div>
					<div className="pp-paragraph">
						if you have any questions about gangs.gg’s privacy policy, the data we hold on you, or you would like to
						exercise one of your data protection rights, please do not hesitate to contact us
						<br />
						<br />
						email us at: deklein@live.com
					</div>
				</div>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
