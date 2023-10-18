import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { setPreferences } from "../../store/userPreferencesSlice";
import "./smallTile.scss";

type Props = {
  title: string;
  imageLink: string;
  routerLink: string;
};

export default function SmallTile(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const preferencesState = useSelector((state: RootState) => state.preferences);
  return (
    // <article className="tile-box" style={{ backgroundImage: `url(${props.imageLink})` }}>
    <article
      className="small-tile-box"
      onClick={() => {
        if (props.routerLink === "https://discord.gg/2JUsEphFwG") window.open(props.routerLink);
        else if (props.routerLink === "/general-profile") {
          dispatch(
            setPreferences({
              ...preferencesState,
              lastProfileMenu: 1,
            })
          );
          navigate(`${props.routerLink}`);
        } else navigate(`${props.routerLink}`);
      }}
    >
      <div className="small-tile-overlay">
        <i className={props.imageLink}></i>
        <h3 className="medium-title">{props.title}</h3>
      </div>
    </article>
  );
}
