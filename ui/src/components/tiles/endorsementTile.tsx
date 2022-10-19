import { useEffect, useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import './endorsementTile.scss';

type Props = {
	title: string;
	value: number;
	isInput: boolean;
	alreadyEndorsed: number;
};

export default function EndorsementTile(props: Props) {
	const [tile, settile] = useState(<li></li>);
	useEffect(() => {
		createTile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const endorseMenu: any = useRef(null);

	const endorsementPressed = (value: number) => {
		console.log('endoresement pressed! ', value);
	};
	const createEndorsementOptions = () => {
		const items: any = [];
		items.push({
			label: (
				<div
					className='notification-container'
					onClick={() => {
						endorsementPressed(1);
					}}
				>
					👍
				</div>
			),
		});
		items.push({
			label: (
				<div
					className='notification-container'
					onClick={() => {
						endorsementPressed(-1);
					}}
				>
					👎
				</div>
			),
		});
		items.push({
			label: (
				<div
					className='notification-container'
					onClick={() => {
						endorsementPressed(0);
					}}
				>
					🚫
				</div>
			),
		});
		return items;
	};

	const createTile = () => {
		if (props.isInput) {
			settile(
				<div className='endorsement-input-box' onClick={(event) => endorseMenu.current.toggle(event)}>
					<h3 className='endorsement-title'>
						{props.title} {props.alreadyEndorsed === 1 ? '👍' : props.alreadyEndorsed === -1 ? '👎' : ''}
					</h3>
				</div>
			);
		} else {
			settile(
				<div className='endorsement-box' onClick={() => {}}>
					<div className='endorsement-value'>
						{props.value > 0 ? '+' : ''}
						{props.value}
					</div>
					<h3 className='endorsement-title'>{props.title}</h3>
				</div>
			);
		}
	};
	return (
		<div
			className={`master-endorse-box ${props.isInput ? 'hover-class' : ''}`}
			style={{ outlineStyle: props.alreadyEndorsed !== 0 ? 'solid' : 'none' }}
		>
			<Menu model={createEndorsementOptions()} popup ref={endorseMenu} id='popup_menu' />
			{tile}
		</div>
	);
}
