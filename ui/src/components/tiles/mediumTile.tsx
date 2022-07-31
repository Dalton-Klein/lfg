import React from "react";
import { useNavigate } from "react-router-dom";
import "./mediumTile.scss";

type Props = {
  title: string;
  imageLink: string;
  routerLink: string;
};

export default function MediumTile(props: Props) {
  const navigate = useNavigate();
  return (
    // <article className="tile-box" style={{ backgroundImage: `url(${props.imageLink})` }}>
    <article className="tile-box" onClick={() => navigate(`${props.routerLink}`)}>
      <div className="medium-gradient-overlay">
        <h1 className="medium-title">{props.title}</h1>
        <i className={props.imageLink}></i>
      </div>
    </article>
  );
}
