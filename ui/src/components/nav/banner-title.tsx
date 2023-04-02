import './banner-title.scss';

type Props = {
  title: string;
  imageLink: string;
};

export default function BannerTitle(props: Props) {
  return (
    <article className={props.imageLink === '' ? 'header-rust default-gradient' : 'header-rust'}>
      {props.imageLink === '' ? (
        <></>
      ) : (
        <img className='header-rust-image' alt='banner title backdrop' src={props.imageLink}></img>
      )}

      <h1>{props.title}</h1>
    </article>
  );
}
