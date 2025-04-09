import { useEffect, useState } from "react";
import axios from "axios";

function ProfilArtisan() {
    
    const [disponibilites, setDisponibilites] = useState([]);
    const [newDispo, setNewDispo] = useState({
      jour: "",
      heureDebut: "",
      heureFin: ""
    });
    
    const supprimerDispo = async (index) => {
        try {
          const nouvellesDispos = [...disponibilites];
          nouvellesDispos.splice(index, 1); // on enlève celle qu'on veut
      
          const res = await axios.put(`http://localhost:5000/api/artisans/${artisan._id}`, {
            disponibilites: nouvellesDispos
          });
      
          setDisponibilites(res.data.disponibilites);
        } catch (err) {
          console.error("Erreur suppression dispo :", err);
        }
      };
      

  const [artisan, setArtisan] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("artisan");
    if (saved) {
      setArtisan(JSON.parse(saved));
      setDisponibilites(JSON.parse(saved).disponibilites || []);
    }
  }, []);

  if (!artisan) return <p>Non connecté ❌</p>;

  return (
    <div>
      <h2>Profil de {artisan.nom} 👷‍♂️</h2>
      <p><strong>Email :</strong> {artisan.email}</p>
      <p><strong>Métier :</strong> {artisan.métier}</p>
      <p><strong>Ville :</strong> {artisan.ville}</p>
      <p><strong>Téléphone :</strong> {artisan.téléphone}</p>
      <p><strong>Description :</strong> {artisan.description}</p>

      {/* Plus tard ici : bouton modifier, gérer créneaux, photos, etc. */}

      <hr />
<h3>Mes créneaux de dispo 🗓️</h3>

<form onSubmit={async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(`http://localhost:5000/api/artisans/${artisan._id}`, {
      disponibilites: [...disponibilites, newDispo]
    });
    setDisponibilites(res.data.disponibilites); // réponse mise à jour
    setNewDispo({ jour: "", heureDebut: "", heureFin: "" }); // reset form
  } catch (err) {
    console.error("Erreur ajout dispo :", err);
  }
}}>
  <select name="jour" value={newDispo.jour} onChange={(e) => setNewDispo({ ...newDispo, jour: e.target.value })} required>
    <option value="">Jour</option>
    <option value="lundi">Lundi</option>
    <option value="mardi">Mardi</option>
    <option value="mercredi">Mercredi</option>
    <option value="jeudi">Jeudi</option>
    <option value="vendredi">Vendredi</option>
    <option value="samedi">Samedi</option>
    <option value="dimanche">Dimanche</option>
  </select>
  <input type="time" value={newDispo.heureDebut} onChange={(e) => setNewDispo({ ...newDispo, heureDebut: e.target.value })} required />
  <input type="time" value={newDispo.heureFin} onChange={(e) => setNewDispo({ ...newDispo, heureFin: e.target.value })} required />
  <button type="submit">Ajouter</button>
</form>

<ul>
  {disponibilites.map((d, index) => (
    <li key={index}>
      {d.jour} de {d.heureDebut} à {d.heureFin}
      <button onClick={() => supprimerDispo(index)} style={{ marginLeft: "1rem", color: "red" }}>
        Supprimer
      </button>
    </li>
  ))}
</ul>

    </div>

    
  );
}

export default ProfilArtisan;
