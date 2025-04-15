import Register from "./Register";
import Login from "./Login";

function JeSuisArtisan() {
  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem", margin:"60px 0" }}>
      {/* Partie Connexion */}
      <div style={{ flex: 1, background: "#f1f1f1", padding: "1rem" }}>
        <h2>Déjà inscrit ?</h2>
        <Login />
      </div>

      {/* Partie Inscription */}
      <div style={{ flex: 1, background: "#f1f1f1", padding: "1rem" }}>
        <h2>Nouvel artisan ? Crée ton compte</h2>
        <Register />
      </div>
    </div>
  );
}

export default JeSuisArtisan;
