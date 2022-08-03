import { useNavigate } from "react-router-dom";
import "./headerFooterComponents.scss";
import ProfileInlayComponet from "./profileInlayComponet";

export default function HeaderComponent() {
  const navigate = useNavigate();
  return (
    <div className="master-container">
      <div className="header-container">
        <h2 onClick={() => navigate(`/`)}>lfg</h2>
        <ProfileInlayComponet />
      </div>
      <div className="gradient-bar"></div>
    </div>
  );
}
