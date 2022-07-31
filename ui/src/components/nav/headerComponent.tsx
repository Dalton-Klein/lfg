import { useNavigate } from "react-router-dom";
import "./headerComponent.scss";
import ProfileInlayComponet from "./profileInlayComponet";

export default function HeaderComponent() {
  const navigate = useNavigate();
  return (
    <div className="header-container">
      <h2 onClick={() => navigate(`/`)}>lfg</h2>
      <ProfileInlayComponet />
    </div>
  );
}
