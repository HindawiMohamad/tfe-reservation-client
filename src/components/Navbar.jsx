import { Link } from "react-router-dom";

function Navbar() {
  const artisan = JSON.parse(localStorage.getItem("artisan"));

  return (
    <nav style={{ background: "#eee", padding: "1rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Accueil</Link>
      <Link to="/artisans" style={{ marginRight: "1rem" }}>Artisans</Link>
      {artisan ? (
        <>
          <Link to="/profil" style={{ marginRight: "1rem" }}>Mon profil</Link>
          <Link to="/mes-reservations">Mes réservations</Link>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>Connexion</Link>
          <Link to="/register">Inscription</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
