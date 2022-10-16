import './banner-title.scss';

export default function BannerTitle(props: any) {
	return (
		<article className="header-rust">
			<img
				className="header-rust-image"
				alt="title banner backdrop rust theme"
				src={'https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png'}
			></img>
			<h1>{props.title}</h1>
		</article>
	);
}
