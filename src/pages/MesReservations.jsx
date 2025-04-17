import { useEffect, useState } from "react";
import axios from "axios";

function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const artisan = JSON.parse(localStorage.getItem("artisan"));

  useEffect(() => {
    if (!artisan) return;

    axios.get(`http://localhost:5000/api/reservations/artisan/${artisan._id}`)
  .then(res => {
    // On trie les réservations par date décroissante (plus récente en premier)
    const triées = res.data.sort((a, b) => new Date(b.date_rdv) - new Date(a.date_rdv));
    setReservations(triées);
  })
  .catch(err => console.error("Erreur chargement réservations :", err));

  }, [artisan]);

  const now = new Date();

  const supprimerReservation = async (id) => {
    if (!window.confirm("Supprimer cette réservation ?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`);
      setReservations(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur pendant la suppression ❌");
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
            <div key={r._id} style={{ border: "1px solid #ccc", marginTop: "2rem", padding: "1rem" }}>
              <p><strong>Date :</strong> {dateRdv.toLocaleString()}</p>
              <p><strong>Client :</strong> {r.nom_client}</p>
              <p><strong>Email :</strong> {r.email_client}</p>
              <p><strong>Téléphone :</strong> {r.telephone_client || "Non fourni"}</p>
              <p><strong>Message :</strong> {r.message || "Aucun message"}</p>

              {estPasse ? (
                <p style={{ color: "black" }}>
                  ⚫ Le rendez-vous est cloturé, vous pouvez voir la note du client sur votre profil
                </p>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "gray" }}>🕒 Le rendez-vous n'a pas encore eu lieu</p>
                  <button onClick={() => supprimerReservation(r._id)} style={{ background: "red", color: "white" }}>
                    Supprimer
                  </button>
                </div>
              )}

            </div>
          );
        })
      )}
    </div>
  );
}

export default MesReservations;
