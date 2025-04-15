import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const artisan = JSON.parse(localStorage.getItem("artisan"));
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">ArtisanConnect</Link>
        

        <button className="burger" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      <div className={`navbar-right ${open ? "open" : ""}`}>
        <Link to="/">Accueil</Link>
        <Link to="/about">Qui sommes-nous ?</Link>
        <Link to="/artisans">Nos Artisans</Link>

        {artisan ? (
          <>
            <Link to="/profil">Mon profil</Link>
            <Link to="/mes-reservations">Mes réservations</Link>
            <Link to="/"><button onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("artisan");
              window.location.href = "/";
            }}>
              Se déconnecter
            </button></Link>
          </>
        ) : (
          <Link to="/artisan">Je suis artisan</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
