import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { setPreferences } from '../../store/userPreferencesSlice';
import './mediumTile.scss';

type Props = {
	title: string;
	imageLink: string;
	routerLink: string;
};

export default function MediumTile(props: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const preferencesState = useSelector((state: RootState) => state.preferences);
	return (
		// <article className="tile-box" style={{ backgroundImage: `url(${props.imageLink})` }}>
		<article
			className='tile-box'
			onClick={() => {
				if (props.routerLink === 'https://discord.gg/MMaYZ8bUQc') window.open(props.routerLink);
				else if (props.routerLink === '/general-profile') {
					dispatch(
						setPreferences({
							...preferencesState,
							lastProfileMenu: 1,
						})
					);
					navigate(`${props.routerLink}`);
				} else navigate(`${props.routerLink}`);
			}}
		>
			<div className='medium-gradient-overlay'>
				<h3 className='medium-title'>{props.title}</h3>
				<i className={props.imageLink}></i>
			</div>
		</article>
	);
}
