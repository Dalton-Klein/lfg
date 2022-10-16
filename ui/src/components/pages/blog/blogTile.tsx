import './blogTile.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export default function BlogTile(props: any) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const preferencesState = useSelector((state: RootState) => state.preferences);

	return (
		<article
			className="blog-tile-box"
			onClick={() => {
				navigate(`${props.routerLink}`);
			}}
		>
			<div className="blog-tile-overlay">
				<h3 className="blog-tile-title">{props.title}</h3>
				<p>Updated {props.updated_on}</p>
				<p className="blog-preview">{props.preview}</p>
				<img
					className="blog-tile-logo"
					src="https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png"
					alt="gangs-blog-logo"
				></img>
			</div>
		</article>
	);
}
