import FooterComponent from "../../nav/footerComponent";
import "./blogPage.scss";
import BannerTitle from "../../nav/banner-title";
import React from "react";
import BlogTile from "./blogTile";

export default function BlogPage() {
  return (
    <div>
      <div className="blog-master-container">
        <BannerTitle
          title={"blog"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        {/* Welcome */}
        <div className="blog-content-container">
          <BlogTile
            routerLink="/blog/signup-promo"
            title="gangs sign up promo"
            updated_on="06/08/2023 | 2 min read"
            preview="We are giving out $250 in rust skins once the gangs reaches 150 members..."
          ></BlogTile>
          <BlogTile
            routerLink="/blog/rocket-league-minecraft-support"
            title="rocket league & minecraft support"
            updated_on="06/08/2023 | 2 min read"
            preview="Rocket League and Minecraft are coming soon! In short, there are some features we are working on that take priority over adding new games to the
						platform. However, Rocket League will be the second game..."
          ></BlogTile>
          <BlogTile
            routerLink="/blog/how-to-find-great-rust-teammates"
            title="how to find great rust teammates"
            updated_on="06/08/2023 | 2 min read"
            preview="Well, if your irl friends aren't playing this wipe or don't play at all, you have get to know someone in one
						of the most notoriously toxic playerbases. Anyone who plays Rust knows..."
          ></BlogTile>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
