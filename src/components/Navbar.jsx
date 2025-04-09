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
    <Link to="/mes-reservations" style={{ marginRight: "1rem" }}>Mes réservations</Link>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("artisan");
        window.location.href = "/";
      }}
      style={{ background: "none", border: "none", color: "red", cursor: "pointer" }}
    >
      Se déconnecter
    </button>
  </>
) : (
  <>
<Link to="/artisan" style={{ marginRight: "1rem", fontWeight: "bold" }}>
  Je suis artisan
</Link>
  </>
)}

    </nav>
  );
}

export default Navbar;
