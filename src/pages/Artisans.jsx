import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // pour faire des liens

function Artisans() {
  const [artisans, setArtisans] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/artisans")
      .then(res => setArtisans(res.data))
      .catch(err => console.error("Erreur API :", err));
  }, []);

  return (
    <div>
      <h2>Nos artisans dispo 🧰</h2>

      {artisans.map(art => (
        <div key={art._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{art.nom}</h3>
          <p><strong>Métier :</strong> {art.métier}</p>
          <p><strong>Ville :</strong> {art.ville}</p>
          
          {/* lien vers la page détail */}
          <Link to={`/artisans/${art._id}`}>Voir le détail 🔍</Link>
        </div>
      ))}
    </div>
  );
}

export default Artisans;
