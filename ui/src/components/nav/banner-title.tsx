import "./banner-title.scss";

export default function BannerTitle(props: any) {
  return (
    <article
      className="header-rust"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png)",
      }}
    >
      <div>{props.title}</div>
    </article>
  );
}
