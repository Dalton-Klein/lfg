import "./aboutComponent.scss";

export default function HomePage() {
  return (
    <div className="about-container">
      <div className="column-1">
        <div className="about-text">
          finding suitable teammates in game is tough. finding them here isn't. find the right teammate based on criteria that matters to you.
        </div>
      </div>
      <div className="column-2">
        <div className="connection-feed">Dalton connected with Madison 4 minutes ago.</div>
      </div>
    </div>
  );
}
