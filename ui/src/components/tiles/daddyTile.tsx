import React from 'react';
import { useNavigate } from 'react-router-dom';
import './daddyTile.scss';

type Props = {
	has2Buttons: boolean;
	title: string;
	image: any;
	routerLinkLFG: any;
	routerLinkLFM?: any;
	buttonTextLFG: string;
	buttonTextLFM?: string;
};
export default function DaddyTile(props: Props) {
	const navigate = useNavigate();

	return (
		<article className='daddy-box' style={{ backgroundImage: `url(${props.image})` }}>
			<div className='daddy-gradient-overlay'>
				<h2 className='daddy-title'>{props.title}</h2>
				<div className='button-rack'>
					<button className='text-only-button daddy-alt-button' onClick={() => navigate(`${props.routerLinkLFG}`)}>
						{props.buttonTextLFG}
					</button>
					{props.has2Buttons ? (
						<button className='text-only-button daddy-alt-button' onClick={() => navigate(`${props.routerLinkLFM}`)}>
							{props.buttonTextLFM}
						</button>
					) : (
						<></>
					)}
				</div>
			</div>
		</article>
	);
}
