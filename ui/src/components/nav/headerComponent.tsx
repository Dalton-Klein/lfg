import { useNavigate } from "react-router-dom";
import "./headerFooterComponents.scss";
import ProfileInlayComponet from "./profileInlayComponet";

export default function HeaderComponent({ socketRef }) {
  const navigate = useNavigate();
  return (
    <div className="master-container">
      <div className="header-container">
        <div className="header-site-title" onClick={() => navigate(`/`)}>
          gangs
        </div>
        <ProfileInlayComponet socketRef={socketRef} />
      </div>
      <div className="gradient-bar"></div>
    </div>
  );
}
