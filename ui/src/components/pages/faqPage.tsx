import FooterComponent from '../nav/footerComponent';
import HeaderComponent from '../nav/headerComponent';
import './faqPage.scss';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setPreferences } from '../../store/userPreferencesSlice';
import { Menu } from 'primereact/menu';

export default function FAQPage() {
	const dispatch = useDispatch();

	const preferencesState = useSelector((state: RootState) => state.preferences);

	useEffect(() => {
		changeSelection(preferencesState.lastFAQMenu);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	//BEGIN Nav logic
	useEffect(() => {
		changeSelection(preferencesState.lastFAQMenu);
		// eslint-disable-next-line
	}, [preferencesState.lastFAQMenu]);

	const changeSelection = (value: number) => {
		dispatch(
			setPreferences({
				...preferencesState,
				lastFAQMenu: value,
			})
		);
	};

	const menu: any = useRef(null);
	const navItems = [
		{
			label: 'getting started',
			items: [
				{
					label: 'welcome',
					icon: 'pi pi-fw pi-user',
					command: () => {
						changeSelection(1);
					},
				},
				{
					label: 'creating account',
					icon: 'pi pi-fw pi-map',
					command: () => {
						changeSelection(7);
					},
				},
				{
					label: 'managing profile',
					icon: 'pi pi-fw pi-cog',
					command: () => {
						changeSelection(6);
					},
				},
			],
		},
		{
			label: 'finding players',
			items: [
				{
					label: 'discover',
					icon: 'pi pi-fw pi-users',
					command: () => {
						changeSelection(2);
					},
				},
			],
		},
		{
			label: 'making connections',
			items: [
				{
					label: 'sending requests',
					icon: 'pi pi-fw pi-arrow-circle-up',
					command: () => {
						changeSelection(3);
					},
				},
				{
					label: 'accepting requests',
					icon: 'pi pi-fw pi-arrow-circle-down',
					command: () => {
						changeSelection(4);
					},
				},
				{
					label: 'messaging',
					icon: 'pi pi-fw pi-envelope',
					command: () => {
						changeSelection(5);
					},
				},
			],
		},
		{
			label: 'faq',
			items: [
				{
					label: 'frequently asked questions',
					icon: 'pi pi-fw pi-arrow-circle-up',
					command: () => {
						changeSelection(3);
					},
				},
			],
		},
	];
	return (
		<div>
			<HeaderComponent></HeaderComponent>
			<div className="faq-master-container">
				<div className="faq-menu">
					<Menu model={navItems} popup ref={menu} id="popup_menu" />
					<button className="faq-navigator" onClick={(event) => menu.current.toggle(event)}>
						<i className="pi pi-bars" />
					</button>
					<div className="faq-title">help | faq</div>
				</div>
				{/* Welcome */}
				<div className="faq-content-container">
					<div className="faq-sub-title">welcome</div>
					<div className="faq-paragraph">
						welcome to gangs, the most efficient place to find your gamer gang. gangs was created to eliminate the
						effort and luck required to find compatible multiplayer teammates. the mission is to get you signed up,
						quickly collect the important details, and get your future teammates in front of you quickly.
					</div>
					<div className="faq-paragraph">welcome to gangs, the most efficient place to find your gamer gang.</div>
				</div>
				{/* Creating Account */}
				<div className="faq-content-container">
					<div className="faq-sub-title">creating account</div>
					<div className="faq-paragraph">welcome to gangs,</div>
					<div className="faq-paragraph">welcome to gangs,</div>
				</div>
				{/* Managing Profile */}
				<div className="faq-content-container">
					<div className="faq-sub-title">managing profile</div>
					<div className="faq-paragraph">welcome to gangs,</div>
					<div className="faq-paragraph">welcome to gangs,</div>
				</div>
				{/* Discover */}
				<div className="faq-content-container">
					<div className="faq-sub-title">discovering players</div>
					<div className="faq-paragraph">welcome to gangs,</div>
					<div className="faq-paragraph">welcome to gangs,</div>
				</div>
				{/* Sending Requests */}
				<div className="faq-content-container">
					<div className="faq-sub-title">sending requests</div>
					<div className="faq-paragraph">welcome to gangs,</div>
					<div className="faq-paragraph">welcome to gangs,</div>
				</div>
				{/* Accepting Requests */}
				<div className="faq-content-container">
					<div className="faq-sub-title">accepting requests</div>
					<div className="faq-paragraph">welcome to gangs,</div>
					<div className="faq-paragraph">welcome to gangs,</div>
				</div>
				{/* Messaging */}
				<div className="faq-content-container">
					<div className="faq-sub-title">messaging</div>
					<div className="faq-paragraph">welcome to gangs,</div>
					<div className="faq-paragraph">welcome to gangs,</div>
				</div>
			</div>
			<FooterComponent></FooterComponent>
		</div>
	);
}
