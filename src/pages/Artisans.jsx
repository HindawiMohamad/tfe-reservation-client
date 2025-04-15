import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [triNote, setTriNote] = useState(false);
  const [villes, setVilles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/artisans")
      .then(res => {
        setArtisans(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error("Erreur API artisans :", err));
  }, []);

  // Charger les villes depuis JSON
  useEffect(() => {
    fetch("/data/villes_belgique.json")
      .then(res => res.json())
      .then(data => setVilles(data))
      .catch(err => console.error("Erreur chargement villes :", err));
  }, []);

  // Suggestions de ville en fonction du code postal
  useEffect(() => {
    if (codePostal.length >= 2) {
      const match = villes.filter(v =>
        v.codePostal.startsWith(codePostal)
      );
      setSuggestions(match);
    } else {
      setSuggestions([]);
    }
  }, [codePostal, villes]);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...artisans];

    if (search) {
      result = result.filter(a =>
        a.nom.toLowerCase().includes(search.toLowerCase()) ||
        a.métier.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (codePostal) {
      const villesMatch = suggestions.map(s => s.ville.toLowerCase());
      result = result.filter(a => villesMatch.includes(a.ville.toLowerCase()));
    }

    if (triNote) {
      result.sort((a, b) => (b.note_moyenne || 0) - (a.note_moyenne || 0));
    }

    setFiltered(result);
  }, [search, codePostal, triNote, artisans, suggestions]);

  const handleSuggestionClick = (ville, code) => {
    setCodePostal(code); // garde l’affichage du CP
    setSuggestions([]);
    // filtre se fait automatiquement
  };

  return (
    <div style={{ padding: "1rem", margin:"100px 0" }}>
      <div className="filters" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Recherche par nom ou métier"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Code postal"
          value={codePostal}
          onChange={(e) => setCodePostal(e.target.value)}
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            style={{ width: "35px" }}
            type="checkbox"
            checked={triNote}
            onChange={(e) => setTriNote(e.target.checked)}
          />
          <label style={{ width: "250px" }}>
            Trier par note ⭐
          </label>
        </div>
      </div>

      {/* Suggestions de ville */}
      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}>
          {suggestions.map((v, i) => (
            <li key={i}
                onClick={() => handleSuggestionClick(v.ville, v.codePostal)}
                style={{ cursor: "pointer", background: "#eee", padding: "0.5rem", marginBottom: "0.3rem" }}>
              {v.codePostal} – {v.ville}
            </li>
          ))}
        </ul>
      )}

      <hr />

      {filtered.length === 0 ? (
        <p>Aucun artisan trouvé 🧐</p>
      ) : (
        filtered.map((art) => (
          <div key={art._id} className="card">
            <h3>{art.nom}</h3>
            <p><strong>Métier :</strong> {art.métier}</p>
            <p><strong>Ville :</strong> {art.ville}</p>
            <p><strong>Note :</strong> {art.note_moyenne ? art.note_moyenne.toFixed(1) + " / 5" : "Pas encore noté"}</p>

            <Link to={`/artisans/${art._id}`}>
              <button style={{ marginTop: "0.5rem" }}>Profil de l'artisan</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Artisans;
