import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function ArtisanDetail() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [avis, setAvis] = useState([]);
  const [moyenne, setMoyenne] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [creneauxDispo, setCreneauxDispo] = useState([]);

  const [formData, setFormData] = useState({
    nom_client: "",
    email_client: "",
    message: "",
    date_rdv: ""
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resArtisan = await axios.get(`http://localhost:5000/api/artisans/${id}`);
        const resAvis = await axios.get(`http://localhost:5000/api/avis/artisan/${id}`);
        const resMoyenne = await axios.get(`http://localhost:5000/api/avis/artisan/${id}/moyenne`);

        setArtisan(resArtisan.data);
        setAvis(resAvis.data);
        setMoyenne(resMoyenne.data.moyenne);
        setLoading(false);
      } catch (err) {
        console.error("Erreur :", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const envoyerReservation = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/reservations", {
        ...formData,
        artisan_id: id
      });

      setSuccess(true);
      setFormData({ nom_client: "", email_client: "", message: "", date_rdv: "" });
    } catch (err) {
      console.error("Erreur réservation :", err);
    }
  };

  const chargerCreneaux = async (date) => {
    setSelectedDate(date);
    const dateFormatee = date.toISOString().split('T')[0];

    try {
      const res = await axios.get(`http://localhost:5000/api/disponibilites/${id}/disponibilites-libres?date=${dateFormatee}`);
      setCreneauxDispo(res.data.creneaux);
    } catch (err) {
      console.error("Erreur chargement créneaux :", err);
      setCreneauxDispo([]);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!artisan) return <p>Artisan introuvable 😢</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{artisan.nom}</h2>
      <p><strong>Métier :</strong> {artisan.métier}</p>
      <p><strong>Ville :</strong> {artisan.ville}</p>
      <p><strong>Téléphone :</strong> {artisan.téléphone}</p>
      <p><strong>Description :</strong> {artisan.description}</p>

      <hr />

      <h3>Avis des clients ⭐</h3>
      <p><strong>Note moyenne :</strong> {moyenne ? `${moyenne} / 5` : "Pas encore noté"}</p>

      {avis.length === 0 ? (
        <p>Aucun avis pour l’instant...</p>
      ) : (
        avis.map((a) => (
          <div key={a._id} style={{ background: "#f9f9f9", padding: "0.5rem", margin: "0.5rem 0" }}>
            <p><strong>Note :</strong> {a.note} / 5</p>
            <p><strong>Commentaire :</strong> {a.commentaire || "Pas de message"}</p>
          </div>
        ))
      )}

      <hr />

      <button onClick={() => setShowForm(!showForm)} style={{ marginTop: "1rem" }}>
        {showForm ? "Fermer le formulaire" : "Prendre un rendez-vous 📅"}
      </button>

      {showForm && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <h4>Sélectionne une date 📅</h4>
            <Calendar onChange={chargerCreneaux} value={selectedDate} />
          </div>

          {selectedDate && (
            <div style={{ marginTop: "1rem" }}>
              <h4>Créneaux dispos pour le {selectedDate.toLocaleDateString()}</h4>
              {creneauxDispo.length === 0 ? (
                <p>Aucun créneau disponible ce jour-là 😕</p>
              ) : (
                <ul>
                  {creneauxDispo.map((c, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setFormData({ ...formData, date_rdv: `${selectedDate.toISOString().split('T')[0]}T${c}` })}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={envoyerReservation} style={{ marginTop: "1rem" }}>
            <input
              type="text"
              name="nom_client"
              placeholder="Votre nom"
              value={formData.nom_client}
              onChange={handleChange}
              required
            /><br /><br />

            <input
              type="email"
              name="email_client"
              placeholder="Votre email"
              value={formData.email_client}
              onChange={handleChange}
              required
            /><br /><br />

            <input
              type="datetime-local"
              name="date_rdv"
              value={formData.date_rdv}
              onChange={handleChange}
              required
            /><br /><br />

            <textarea
              name="message"
              placeholder="Votre message (optionnel)"
              value={formData.message}
              onChange={handleChange}
            ></textarea><br /><br />

            <button type="submit">Envoyer la demande</button>
          </form>
        </>
      )}

      {success && <p style={{ color: "green" }}>✅ Demande envoyée !</p>}
    </div>
  );
}

export default ArtisanDetail;
