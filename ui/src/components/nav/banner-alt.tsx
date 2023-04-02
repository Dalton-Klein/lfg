import { useNavigate } from 'react-router-dom';
import './banner-alt.scss';

type Props = {
	title: string;
	buttonText: string;
	buttonLink: string;
};

export default function BannerAlt(props: Props) {
	const navigate = useNavigate();
	const buttonPressed = () => {
		navigate(props.buttonLink);
	};
	return (
		<div className='alt-banner-box'>
			<h1>{props.title}</h1>
			<button className='text-only-button banner-alt-button' onClick={buttonPressed}>
				{props.buttonText}
			</button>
		</div>
	);
}
