import React from 'react';
import { useNavigate } from 'react-router-dom';
import './daddyTile.scss';

export default function DaddyTile(props: any) {
	const navigate = useNavigate();

	return (
		<article
			className="daddy-box"
			onClick={() => navigate(`${props.routerLink}`)}
			style={{ backgroundImage: `url(${props.image})` }}
		>
			<div className="daddy-gradient-overlay">
				<h2 className="daddy-title">{props.title}</h2>
			</div>
		</article>
	);
}
