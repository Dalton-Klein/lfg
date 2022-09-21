import React from 'react';
import { useNavigate } from 'react-router-dom';
import './daddyTile.scss';

export default function DaddyTile(props: any) {
	const navigate = useNavigate();

	let bgImage = 'https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png';
	return (
		<article
			className="daddy-box"
			onClick={() => navigate(`${props.routerLink}`)}
			style={{ backgroundImage: `url(${bgImage})` }}
		>
			<div className="daddy-gradient-overlay">
				<h1 className="daddy-title">rust</h1>
			</div>
		</article>
	);
}
