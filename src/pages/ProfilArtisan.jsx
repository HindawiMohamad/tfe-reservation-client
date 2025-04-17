import { useEffect, useState } from "react";
import axios from "axios";

function ProfilArtisan() {
  const [artisan, setArtisan] = useState(null);
  const [newDispo, setNewDispo] = useState({ jour: "", heureDebut: "", heureFin: "" });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("artisan");
    if (saved) {
      const parsed = JSON.parse(saved);
      setArtisan(parsed);
    }
  }, []);

  const ajouterDispo = async (e) => {
    e.preventDefault();
    try {
      const nouvellesDispos = [...(artisan.disponibilites || []), newDispo];

      await axios.put(`http://localhost:5000/api/artisans/${artisan._id}`, {
        disponibilites: nouvellesDispos
      });

      const artisanMaj = await axios.get(`http://localhost:5000/api/artisans/${artisan._id}`);
      localStorage.setItem("artisan", JSON.stringify(artisanMaj.data));
      setArtisan(artisanMaj.data);

      setNewDispo({ jour: "", heureDebut: "", heureFin: "" });
    } catch (err) {
      console.error("Erreur ajout dispo :", err);
      alert("Erreur lors de l'ajout du créneau");
    }
  };

  const supprimerDispo = async (index) => {
    try {
      const nouvellesDispos = [...(artisan.disponibilites || [])];
      nouvellesDispos.splice(index, 1);

      await axios.put(`http://localhost:5000/api/artisans/${artisan._id}`, {
        disponibilites: nouvellesDispos
      });

      const artisanMaj = await axios.get(`http://localhost:5000/api/artisans/${artisan._id}`);
      localStorage.setItem("artisan", JSON.stringify(artisanMaj.data));
      setArtisan(artisanMaj.data);
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
      setArtisan(artisanMaj.data);
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Erreur pendant l'envoi ❌");
    }
  };

  const supprimerPhoto = async (photoUrl) => {
    if (!window.confirm("Supprimer cette photo ?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/artisans/${artisan._id}/photo`, {
        data: { photo: photoUrl },
        headers: { Authorization: `Bearer ${token}` }
      });

      const artisanMaj = await axios.get(`http://localhost:5000/api/artisans/${artisan._id}`);
      localStorage.setItem("artisan", JSON.stringify(artisanMaj.data));
      setArtisan(artisanMaj.data);
    } catch (err) {
      console.error("Erreur suppression photo :", err);
      alert("Erreur pendant la suppression ❌");
    }
  };

  if (!artisan) return <p>Non connecté ❌</p>;

  return (
    <div style={{ padding: "1rem", margin:"100px 0"  }}>
      <h2>Profil de {artisan.nom} 👷‍♂️</h2>
      <p><strong>Email :</strong> {artisan.email}</p>
      <p><strong>Métier :</strong> {artisan.métier}</p>
      <p><strong>Ville :</strong> {artisan.ville}</p>
      <p><strong>Téléphone :</strong> {artisan.téléphone}</p>
      <p><strong>Description :</strong> {artisan.description}</p>

      <hr />

      <h3>Mes créneaux de dispo 🗓️</h3>
      <form onSubmit={ajouterDispo}>
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

      {artisan.disponibilites?.map((d, index) => (
        <div key={index} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{d.jour} de {d.heureDebut} à {d.heureFin}</span>
          <button onClick={() => supprimerDispo(index)} style={{ background: "red", color: "white" }}>
            Supprimer
          </button>
        </div>
      ))}

      <hr />

      <h3>Ajouter une photo 📸</h3>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" required />
        <button type="submit">Uploader</button>
      </form>

      <hr />

      <h3>Mes photos 📷</h3>
      {artisan.photos?.length > 0 ? (
        <div className="galerie">
          {artisan.photos.map((photoUrl, index) => (
            <div key={index} className="galerie-item" style={{ position: "relative" }}>
              <img src={`http://localhost:5000${photoUrl}`} alt={`Photo ${index + 1}`} />
              <button
                onClick={() => supprimerPhoto(photoUrl)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255,0,0,0.8)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  cursor: "pointer"
                }}
                title="Supprimer la photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune photo pour le moment.</p>
      )}
    </div>
  );
}

export default ProfilArtisan;
