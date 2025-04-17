import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AvisRdv() {
  const { id } = useParams(); // ID de la réservation
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");
  const [artisanId, setArtisanId] = useState(null);
  const [avisExiste, setAvisExiste] = useState(false);

  // 🔍 On va chercher l'artisan_id via la réservation
  useEffect(() => {
    const fetchResa = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reservations/${id}`);
        setArtisanId(res.data.artisan_id);
      } catch (err) {
        console.error("❌ Impossible de récupérer la réservation :", err.message);
      }
    };

    const checkAvis = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/avis/reservation/${id}`);
          if (res.data && res.data._id) {
            setAvisExiste(true);
          }
        } catch (err) {
          // aucun avis = pas grave
        }
      };

    checkAvis();  
    fetchResa();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log("📦 Données envoyées :", {
            note,
            commentaire,
            reservation_id: id,
            artisan_id: artisanId,
          });
          
      await axios.post("http://localhost:5000/api/avis", {
        note,
        commentaire,
        reservation_id: id,
        artisan_id: artisanId, // ✅ on l’envoie bien
      });

      setEnvoye(true);
      setErreur("");
    } catch (err) {
      console.error("❌ Erreur axios :", err.response?.data || err.message);
      setErreur(err.response?.data?.msg || "Une erreur est survenue 😢");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin:"100px 0" }}>
      <h2>Votre avis sur l'artisan</h2>

      {avisExiste ? (
        <p style={{ color: "green" }}>✅ Merci, vous avez déjà laissé un avis !</p>
        ) : envoye ? (
        <p style={{ color: "green" }}>✅ Merci pour votre avis !</p>
        ) : (
        <form onSubmit={handleSubmit}>
          <label>Note /5 :</label><br />
          <input
            type="number"
            min={1}
            max={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          /><br /><br />

          <label>Commentaire (optionnel) :</label><br />
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            rows={4}
            placeholder="Votre retour sur le service..."
          ></textarea><br /><br />

          <button type="submit" disabled={!artisanId}>Envoyer l’avis</button>
        </form>
      )}

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
    </div>
  );
}

export default AvisRdv;
