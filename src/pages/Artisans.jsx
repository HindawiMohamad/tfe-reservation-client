import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [ville, setVille] = useState("");
  const [triNote, setTriNote] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/artisans")
      .then(res => {
        setArtisans(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error("Erreur API :", err));
  }, []);

  useEffect(() => {
    let result = [...artisans];

    if (search) {
      result = result.filter(a =>
        a.nom.toLowerCase().includes(search.toLowerCase()) ||
        a.métier.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (ville) {
      result = result.filter(a => a.ville.toLowerCase() === ville.toLowerCase());
    }

    if (triNote) {
      result.sort((a, b) => (b.note_moyenne || 0) - (a.note_moyenne || 0));
    }

    setFiltered(result);
  }, [search, ville, triNote, artisans]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Nos artisans dispo 🧰</h2>

      <input
        type="text"
        placeholder="Recherche par nom ou métier"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={ville} onChange={(e) => setVille(e.target.value)}>
        <option value="">Toutes les villes</option>
        <option value="Bruxelles">Bruxelles</option>
        <option value="Anderlecht">Anderlecht</option>
        <option value="Ixelles">Ixelles</option>
        <option value="Molenbeek">Molenbeek</option>
        <option value="Schaerbeek">Schaerbeek</option>
        <option value="Forest">Forest</option>
      </select>

      <label style={{ marginLeft: "1rem" }}>
        <input
          type="checkbox"
          checked={triNote}
          onChange={(e) => setTriNote(e.target.checked)}
        />
        Trier par note ⭐
      </label>

      <hr />

      {filtered.length === 0 ? (
        <p>Aucun artisan trouvé 🧐</p>
      ) : (
        filtered.map(art => (
          <div key={art._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{art.nom}</h3>
            <p><strong>Métier :</strong> {art.métier}</p>
            <p><strong>Ville :</strong> {art.ville}</p>
            <p><strong>Note :</strong> {art.note_moyenne ? art.note_moyenne.toFixed(1) + " / 5" : "Pas encore noté"}</p>
            <Link to={`/artisans/${art._id}`}>Voir le détail 🔍</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Artisans;
