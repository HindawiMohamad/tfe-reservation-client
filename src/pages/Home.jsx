import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <div className="home-gradient">
        <div className="home-content">
          <h1>Bienvenue sur ArtisanConnect</h1>
          <p>Trouvez un artisan de confiance, près de chez vous.</p>
          <Link to="/artisans">
            <button>Voir les artisans</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
