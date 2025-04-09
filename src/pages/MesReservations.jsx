import { useEffect, useState } from "react";
import axios from "axios";

function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [avisForm, setAvisForm] = useState({});
  const artisan = JSON.parse(localStorage.getItem("artisan"));

  useEffect(() => {
    if (!artisan) return;

    axios.get(`http://localhost:5000/api/reservations/artisan/${artisan._id}`)
      .then(res => setReservations(res.data))
      .catch(err => console.error("Erreur chargement réservations :", err));
  }, [artisan]);

  const now = new Date();

  const handleAvisChange = (reservationId, field, value) => {
    setAvisForm(prev => ({
      ...prev,
      [reservationId]: {
        ...prev[reservationId],
        [field]: value
      }
    }));
  };

  const envoyerAvis = async (reservationId, artisanId) => {
    const form = avisForm[reservationId];
    if (!form || !form.note) return alert("Note obligatoire !");

    try {
      await axios.post("http://localhost:5000/api/avis", {
        reservation_id: reservationId,
        artisan_id: artisanId,
        note: form.note,
        commentaire: form.commentaire || ""
      });
      alert("Avis enregistré ✅");
    } catch (err) {
      console.error("Erreur avis :", err);
      alert("Erreur pendant l'envoi de l'avis ❌");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Mes réservations 📅</h2>

      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        reservations.map((r) => {
          const dateRdv = new Date(r.date_rdv);
          const estPasse = dateRdv < now;

          return (
            <div key={r._id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
              <p><strong>Date :</strong> {new Date(r.date_rdv).toLocaleString()}</p>
              <p><strong>Client :</strong> {r.nom_client} ({r.email_client})</p>
              <p><strong>Message :</strong> {r.message}</p>

              {estPasse ? (
                <div style={{ marginTop: "1rem" }}>
                  <h4>Laisser un avis ⭐</h4>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Note sur 5"
                    value={avisForm[r._id]?.note || ""}
                    onChange={(e) => handleAvisChange(r._id, "note", e.target.value)}
                    required
                  /><br /><br />

                  <textarea
                    placeholder="Commentaire (optionnel)"
                    value={avisForm[r._id]?.commentaire || ""}
                    onChange={(e) => handleAvisChange(r._id, "commentaire", e.target.value)}
                  /><br /><br />

                  <button onClick={() => envoyerAvis(r._id, r.artisan_id)}>Envoyer l'avis</button>
                </div>
              ) : (
                <p style={{ color: "gray" }}>🕒 Le rendez-vous n'a pas encore eu lieu</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MesReservations;
