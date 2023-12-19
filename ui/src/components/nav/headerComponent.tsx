import { useNavigate } from "react-router-dom";
import "./headerFooterComponents.scss";
import ProfileInlayComponet from "./profileInlayComponet";

export default function HeaderComponent({ socketRef }) {
  const navigate = useNavigate();

  return (
    <div className="master-container">
      <div className="header-container">
        <img
          className="site-titlebar-image"
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png"
          alt={`gangs.gg app logo`}
          onClick={() => navigate(`/`)}
        />
        <ProfileInlayComponet socketRef={socketRef} />
      </div>
    </div>
  );
}
