import { useEffect, useState } from "react";
import axios from "axios";

function ProfilArtisan() {
  const [artisan, setArtisan] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [newDispo, setNewDispo] = useState({ jour: "", heureDebut: "", heureFin: "" });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("artisan");
    if (saved) {
      const parsed = JSON.parse(saved);
      setArtisan(parsed);
      setDisponibilites(parsed.disponibilites || []);
    }
  }, []);

  const supprimerDispo = async (index) => {
    try {
      const nouvellesDispos = [...disponibilites];
      nouvellesDispos.splice(index, 1);
      const res = await axios.put(`http://localhost:5000/api/artisans/${artisan._id}`, { disponibilites: nouvellesDispos });
      setDisponibilites(res.data.disponibilites);
    } catch (err) {
      console.error("Erreur suppression dispo :", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Choisis une photo !");

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      await axios.post(`http://localhost:5000/api/artisans/${artisan._id}/photos`, formData);
      const artisanMaj = await axios.get(`http://localhost:5000/api/artisans/${artisan._id}`);
      localStorage.setItem("artisan", JSON.stringify(artisanMaj.data));
      window.location.reload();
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Erreur pendant l'envoi ❌");
    }
  };

  if (!artisan) return <p>Non connecté ❌</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Profil de {artisan.nom} 👷‍♂️</h2>
      <p><strong>Email :</strong> {artisan.email}</p>
      <p><strong>Métier :</strong> {artisan.métier}</p>
      <p><strong>Ville :</strong> {artisan.ville}</p>
      <p><strong>Téléphone :</strong> {artisan.téléphone}</p>
      <p><strong>Description :</strong> {artisan.description}</p>

      <hr />

      <h3>Mes créneaux de dispo 🗓️</h3>
      <form onSubmit={async (e) => {
        e.preventDefault();
        try {
          const res = await axios.put(`http://localhost:5000/api/artisans/${artisan._id}`, {
            disponibilites: [...disponibilites, newDispo]
          });
          setDisponibilites(res.data.disponibilites);
          setNewDispo({ jour: "", heureDebut: "", heureFin: "" });
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
            <button onClick={() => supprimerDispo(index)} style={{ marginLeft: "1rem", color: "red" }}>Supprimer</button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Ajouter une photo 📸</h3>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" required />
        <button type="submit">Uploader</button>
      </form>

      <hr />

      <h3>Mes photos 📷</h3>
      {artisan.photos && artisan.photos.length > 0 ? (
        artisan.photos.map((photoUrl, index) => (
          <img
            key={index}
            src={`http://localhost:5000${photoUrl}`}
            alt="Intervention artisan"
            style={{ width: "200px", marginRight: "10px", marginBottom: "10px" }}
          />
        ))
      ) : (
        <p>Aucune photo pour le moment.</p>
      )}
    </div>
  );
}

export default ProfilArtisan;
