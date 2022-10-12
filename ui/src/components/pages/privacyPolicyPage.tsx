import React from 'react';
import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import BannerTitle from '../nav/banner-title';
import './privacyPolicyPage.scss';

export default function PrivacyPolicyPage() {
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<BannerTitle title={'privacy policy'}></BannerTitle>
			<div className="pp-master-container">
				{/* Privacy Policy Container */}

				<div className="pp-content-container">
					<div className="pp-sub-title">Introduction</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						gangs.gg is part of Kultured Dev LLC (Incorporated in MN, USA. EIN - 85-0627436) This privacy policy will
						explain what personal information gangs.gg collects, and how we use that personal data when you use our
						website. We are committed to protecting your personal information and your right to privacy.
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">What Do We Collect</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						<li>email</li>
						<li>username / alias</li>
						<li>gender</li>
						<li>age</li>
						<li>profile image</li>
						<li>location - region</li>
						<li>language spoken</li>
						<li>games played</li>
						<li>game-related information - availability, experience</li>
						<li>third-party profiles / usernames - discord, play station network, xbox live</li>
						<li>any other information you voluntarily disclose in our messaging platform</li>
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">How Do We Collect Your Data</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						You directly provide gangs.gg with most of the data we collect. We collect data and process data when you:
						<br />
						<br />
						<li>register an account - personal information </li>
						<li>create your profile - game-related information </li>
						<li>voluntarily disclose information in our messaging platform </li>
						<br />
						<br />
						We may also receive your data indirectly from the following sources:
						<br />
						<br />
						<li>
							Google Oauth - email, account name, given name, family name, google user image, and google account id
						</li>
						<br />
						We use and transfer (to any other app) of information received from Google APIs will adhere to the{' '}
						<a href="https://developers.google.com/terms/api-services-user-data-policy" className="link-text">
							{' '}
							Google API Servcies User Data Policy
						</a>{' '}
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">How Do We Use Your Data</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						We collect your data so that we can:
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
					<div className="pp-sub-title">How Do We Share Your Data</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						In short we only share information with your consent, to comply with laws, to provide you with services, or
						to protect your rights.
					</div>
					<div className="pp-sub-heading">Consent</div>
					<div className="pp-paragraph">
						We may process your data if you have given us specific consent to use your personal information for a
						specific purpose.
					</div>
					<div className="pp-sub-heading">Legal Obligations</div>
					<div className="pp-paragraph">
						We may disclose your information where we are legally required to do so in oder to comply with applicable
						law, governmental requests, a judicial proceeding, court order, or legal process. An example is to comply
						with a court order or subpeona.
					</div>
					<div className="pp-sub-heading">Vital Interests</div>
					<div className="pp-paragraph">
						We may disclose your information where we believe it is necessary to investigate, prevent, or take action
						regarding potential violations of our policies, suspected fraid, situations involving potential threats to
						the safety of any person and illegal activities, or as evidence in litigation in which we are involved.
					</div>
					<div className="pp-sub-heading">Other Users</div>
					<div className="pp-paragraph">
						When you share personal information (for example in your profile or through messaging) or otherwise interact
						with public areas of the gangs website, such personal information may be viewed by all users and may be
						publicly made available outisde of the gangs website in perpetuity. If you interact with other users of our
						website, any communication or profile information will be available to them to view. You can also view
						others' profiles and messages in the discover page and public chat rooms.
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">What Third Parties Do We Share Your Data With</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						At this time, your information is not shared with any third party services. All data is kept in house aside
						from channels listed in the section above titled "How Do We Share Your Data"
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">How Long Do We Keep Your Data</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						We keep your information for as long as necessary to fulfill purposes outline in this privacy policy unless
						otherwise required by law. No purpose in this notice will require us keeping your personal information for
						longer than the period of time in which users have an account with us.
					</div>
					<div className="pp-paragraph">
						After not logging into or otherwise using your account for one full year, your account will be automatically
						deleted and your information removed from our database.
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">How Do We Keep Your Data Safe</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						We have implemented appropriate technical and organizational security measures designed to protect the
						security of any personal information we process. However, despite our safeguards and efforts to secure your
						information, no electronic transmission over the internet or information storage technology can be
						guaranteed to be 100% secure. Because of this, we cannot promise or guarantee that hackers, cybercriminals,
						or other unauthorized third parties will not be able to defeat our security and improperly collect, access,
						steal, or modify your information. Although we will do our best to protect your information, transmission of
						personal information to and from our website is at your own risk. You should only access teh website within
						a secure environment.
					</div>
					<div className="pp-paragraph">
						After not logging into your account for one twelve full months, your account will be automatically deleted
						and your information removed from our database.
					</div>
				</div>
				<div className="pp-content-container">
					<div className="pp-sub-title">How To Contact Us</div>
					<div className="gradient-bar"></div>
					<div className="pp-paragraph">
						If you have any questions about gangs.gg’s privacy policy, the data we hold on you, or you would like to
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
