import React from 'react';
import { useNavigate } from 'react-router-dom';
import './gameTile.scss';

type Props = {
	title: string;
	imageLink: string;
	routerLink: string;
	changeBanner: any;
};

export default function GameTile(props: Props) {
	const navigate = useNavigate();
	return (
		// <article className="tile-box" style={{ backgroundImage: `url(${props.imageLink})` }}>
		<article
			className='game-tile-box'
			onClick={() => {
				props.changeBanner(`${props.imageLink}`);
				navigate(`${props.routerLink}`);
			}}
			style={{ backgroundImage: `url(${props.imageLink})` }}
		>
			<div className='game-tile-content-container'>
				<h3 className='game-tile-title'>{props.title}</h3>
			</div>
		</article>
	);
}
