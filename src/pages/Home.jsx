import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Bienvenue sur notre plateforme de réservation d’artisans 👷‍♂️</h1>
      <p>Trouvez un artisan, réservez un rendez-vous, laissez un avis 💪</p>
      <Link to="/artisans">
        <button style={{ marginTop: "1rem" }}>Voir les artisans</button>
      </Link>
    </div>
  );
}

export default Home;
