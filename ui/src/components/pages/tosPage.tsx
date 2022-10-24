import React from 'react';
import { useNavigate } from 'react-router-dom';
import BannerTitle from '../nav/banner-title';
import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './tosPage.scss';

export default function TermsOfServicePage() {
	const navigate = useNavigate();
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<BannerTitle
				title={'terms of service'}
				imageLink={'https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png'}
			></BannerTitle>
			<div className='tos-master-container'>
				{/* Privacy Policy Container */}
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Introduction</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						These Terms of Use constitute a legally binding contract between Kultured Dev LLC (hereinafter “Gangs”) and
						the User and/or Member.
						<br />
						Gangs provides a platform for competitive video-gamers to promote themselves, discover individuals in order
						to connect with other Members and play together on a regular basis, achieved through a matchmaking algorithm
						and electronic communication networks. (hereinafter the “Services”)
						<br />
						By accessing or using gangs.gg (hereinafter the “Website”) and/or registering for the Services made
						available through it you agree to accept these Terms.
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Definitions</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						<li>"Website": the gangs.gg website</li>
						<li>"Services": all the functionality of the website</li>
						<li>"User": a visitor of the website</li>
						<li>"Member": registered user with an account, logged in, and using the services</li>
						<li>"Registration" or "Register": the process of creating an account to gain access to the Services</li>
						<li>"Account": the interface accessible to Memebers, allowing them to benefit from the Services</li>
						<li>"Profile": the content submitted by Members, made available to view by other Memebrs</li>
						<li>"Terms of Use" or "Terms": this contract</li>
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Registration</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						The Services are free to Register and use
						<br />
						<br />
						Costs incurred to access the Services are the responsibility of the User
						<br />
						<br />
						To Register the Member must:
						<br />
						<br />
						<li>Be 13 years of age or older. </li>
						<li>Have read the Privacy Policy</li>
						<li>Have completed mandatory fields during sign up </li>
						<li>Keep password strictly confidential </li>
						<li>Not create more than one account</li>
						<br />
						<br />
						Member agrees that the profile information that they input during Registration is shared with other members
						of the site, with the exception of personal contact information such as email address.
						<br />
						<br />
						Member is responsible for any intermediary using their account, whether fraudulently or not.
						<br />
						<br />
						Gangs is not obliged (and does not have the technical means) to verify the identity of individuals
						registered to the Services. If a Member has reason to believe that another person is using their identity or
						account they must inform Gangs immediately.
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Services available to Member</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						Registration to the Services allows individuals to become a Member and provides access to the following
						features:
						<li>Create a profile - Visible to other Members</li>
						<li>View profles of other compatible Members</li>
						<li>Connect with other Members subject to agreement by both Members</li>
						<li>Access public contact details of connected members (Steam profile link and Discord username)</li>
						<li>
							Member may control, through their account, if their profile is visible (enabled) to other Members thus
							able to be contacted (connection request)
						</li>
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Obligations of Gangs</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						The purpose of the Services is not organising in-person meetings between Members and Gangs does not
						guarantee establishing a stable team, regardless of the Member’s personal motivations.
						<br />
						<br />
						Gangs excludes all liability in connection with events taking place between Members via online interactions
						or in-person meetings arising from the use of the Services.
						<br />
						<br />
						Gangs does not verify the identity of members when they connect.
						<br />
						<br />
						Gangs does not control or moderate exhaustively the content which Members publish or upload on the Service
						under their sole liability.
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Obligations of Member</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						These obligations apply from registration and shall remain applicable for the entire duration of use of the
						Services.
						<br />
						<br />
						Member agrees to comply with any laws in force and respect the rights of other Members.
						<br />
						<br />
						General obligations: - Members have obligations to:
						<br />
						<br />
						<li>Conduct themselves in an honest manner towards Gangs and other Members.</li>
						<li>Respect IP rights of the content provided by Gangs and other Members.</li>
						<li>
							Define the limits of their private life and be responsible for communicating only information which would
							not prejudice them.
						</li>
						Gangs does not control or moderate exhaustively the content which Members publish or upload on the Service
						under their sole liability.
						<br />
						<br />
						Essential obligations: - Members have obligations to:
						<br />
						<br />
						<li>
							Use the Services while respecting their purpose, which is to allow personal, entertainment and
							non-commercial purposes.
						</li>
						<li>
							Not use the Services for professional, commercial, profit (advertising, soliciting clients etc.) or
							generally non-personal purposes.
						</li>
						<li>Not post, display or disseminate, in any form whatsoever, false information or content.</li>
						<li>
							Not post content that violates right of other Members, is contrary to the purpose of the Service and/or
							against the law.
						</li>
						<li>Not harass other Members.</li>
						<li>
							Not mention on the Website any personal information provided by a Member to Gangs (e-mail address, steam
							profile) that would allow a Member to contact another Member without connecting.
						</li>
						<li>
							Not post information or content that disrupts normal use of the Website or Services, interrupting and/or
							slowing communications between Members (Software, viruses, logic bombs, mass connection requests, etc.)
						</li>
						<li>
							Not post information or content incorporating hyperlinks to Third-party Websites that are illegal, immoral
							and/or not conform with the purpose of the Services.
						</li>
						<li>Not post photo(s) or other visual content which features minors.</li>
						<li>Use the confidential password and username of the Member strictly to log in to the Services.</li>
						<li>
							Not communicate, disseminate, share, make accessible, in any way or for any reason whatsoever, Member’s
							passwords and/or usernames to any third party, whoever that is.
						</li>
						<br />
						<br />
						Breach of Essential Obligations constitutes a serious breach by the Member of its contractual obligations.
						<br />
						<br />
						In the event of breach by a Member, Gangs may terminate the contract and permanently delete the relevant
						Member’s Account on the Website.
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Intellectual Property</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						Names, Trademarks, Logos, Graphics, Photographs, Animations, Videos and Text contained on the Websites are
						exclusive property of Gangs. May not be reproduced, used or communicated without express authorisation of
						Gangs.
						<br />
						<br />
						Right of use granted to Members during registration to the Services. Any other use is prohibited.
						<br />
						<br />
						Members are prohibited from modifying, copying, reproducing, downloading, broadcasting, transmitting,
						commercially exploiting and and/or distributing the Services, Website pages or computer codes of the
						elements composing the Services and Websites, in any way whatsoever, subject to legal action.
						<br />
						<br />
						Some of the company and product names, logos, brands, and other trademarks featured may not be owned by us
						and are the property of their respective trademark holders. These trademark holders are not affiliated with,
						nor do they sponsor or endorse Gangs.
						<br />
						<br />
						Gangs isn't endorsed by Facepunch and doesn't reflect the views or opinions of Facepunch or anyone
						officially involved in producing or managing Facepunch properties. Facepunch, and all associated properties
						are trademarks or registered trademarks of Facepunch, Inc.
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Account Closure</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						Each Member may, at any moment, terminate their registration to the Services by requesting the closure of
						their Account through the ‘account settings’ section. This request shall be deemed made immediately.
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Termination</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						In the event of a serious breach by a Member of their obligations we may permanently remove their account
						without prior notice.
						<br />
						<br />
						The Member will be notified via email.
						<br />
						<br />
						Account closure will take effect without prejudice to any damages claimed by Gangs from the Member as
						restitution for the losses incurred by Gangs as a result of the breaches.
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Personal Data</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						Personal data of Members is processed in accordance with the:
						<br />
						<br />
						<div
							className='link-to-pp'
							onClick={() => {
								navigate(`/privacy-policy`);
							}}
						>
							Privacy Policy
						</div>
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>Requests and Claims</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						For requests or claims the Member may contact Gangs by email deklein@live.com
					</div>
				</div>
				<div className='tos-content-container'>
					<div className='tos-sub-title'>about us</div>
					<div className='gradient-bar'></div>
					<div className='tos-paragraph'>
						<li> Kultured Dev LLC - MN, USA</li>
						<li> EIN Number: 85-0627436</li>
						<li> 1400 Park Ave, Minneapolis, MN, 55404</li>
						<br />
						<br />
						For any questions, contact us at deklein@live.com
					</div>
				</div>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
