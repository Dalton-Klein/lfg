import './banner-title.scss';

type Props = {
	title: string;
	imageLink: string;
};

export default function BannerTitle(props: Props) {
	return (
		<article className='header-rust'>
			<img className='header-rust-image' alt='title banner backdrop rust theme' src={props.imageLink}></img>
			<h1>{props.title}</h1>
		</article>
	);
}
