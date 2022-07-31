import React from "react";
import "./daddyTile.scss";

export default function DaddyTile() {
  let bgImage = "/assets/rust-tile-image.png";
  return (
    <article className="daddy-box" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="daddy-gradient-overlay">
        <h1 className="daddy-title">rust</h1>
      </div>
    </article>
  );
}
