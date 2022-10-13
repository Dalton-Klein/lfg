import AboutComponent from '../../pages/home-page/aboutComponent';
import FooterComponent from '../../nav/footerComponent';
import HeaderComponent from '../../nav/headerComponent';
import './homePage.scss';
import MediumTile from '../../tiles/mediumTile';
import DaddyTile from '../../tiles/daddyTile';
// import { logoutUser } from "../../../store/userSlice";

export default function HomePage() {
	// Coffee, use to wipe state if something goes wacky
	// dispatch(logoutUser(1))
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className="title-box">
				{/* <div className="title">gangs</div> */}
				<img className="logo-img" src={'/assets/logo-v2-gangs.gg-transparent-white.png'} alt="gangs logo" />
				<div className="subtitle">find your gang</div>
			</div>
			<div className="tile-container">
				<div className="nav-tiles">
					<MediumTile
						routerLink="https://discord.gg/MMaYZ8bUQc"
						imageLink="pi pi-discord"
						title="join our discord"
					></MediumTile>
					<MediumTile routerLink="/help" imageLink="pi pi-info-circle" title="help | faq"></MediumTile>
				</div>
				<div className="discover-tiles">
					<DaddyTile
						routerLink="/discover"
						image="https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"
						title="rust"
					></DaddyTile>
				</div>
			</div>
			<AboutComponent></AboutComponent>
			<div className="title-box">
				<div className="subtitle">coming soon</div>
			</div>
			<div className="extra-tiles">
				<DaddyTile
					routerLink="/"
					image="https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/minecraft_bscq2s.png"
					title="minecraft"
				></DaddyTile>
				<DaddyTile
					routerLink="/"
					image="https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg"
					title="rocket league"
				></DaddyTile>
			</div>
			<div className="extra-tiles">
				<MediumTile routerLink="/privacy-policy" imageLink="pi pi-shield" title="privacy policy"></MediumTile>
				<MediumTile routerLink="/terms-of-service" imageLink="pi pi-book" title="terms of service"></MediumTile>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
