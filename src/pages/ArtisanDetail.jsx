import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from "react-router-dom";

function getNomJour(date) {
  const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  return jours[date.getDay()];
}

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
    telephone_client: "",
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

      setCreneauxDispo(prev =>
        prev.filter(c => c !== formData.date_rdv.split("T")[1].slice(0, 5))
      );

      setFormData({ nom_client: "", email_client: "", message: "", date_rdv: "", telephone_client: "" });

    } catch (err) {
      console.error("Erreur réservation :", err);
    }
  };

  const chargerCreneaux = async (date) => {
    setSelectedDate(date);

    const jourSelectionne = getNomJour(date);
    const disposDuJour = artisan.disponibilites.filter(d => d.jour === jourSelectionne);

    const creneaux = [];

    disposDuJour.forEach(d => {
      const heureDebut = parseInt(d.heureDebut.split(":")[0], 10);
      const heureFin = parseInt(d.heureFin.split(":")[0], 10);

      for (let h = heureDebut; h < heureFin; h += 2) {
        const heureFormatee = `${h.toString().padStart(2, "0")}:00`;
        creneaux.push(heureFormatee);
      }
    });

    try {
      const resResa = await axios.get(`http://localhost:5000/api/reservations/artisan/${id}`);

      // on prend la date au format YYYY-MM-DD
      const dateStr = date.toISOString().split("T")[0];

      // on extrait les heures réservées pour cette date
      const heuresReservées = resResa.data
        .filter(r => r.date_rdv.startsWith(dateStr))
        .map(r => {
          const heure = new Date(r.date_rdv).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Europe/Brussels", // pour corriger le décalage !
          });
          return heure;
        });

      const disposRestants = creneaux.filter(c => !heuresReservées.includes(c));
      setCreneauxDispo(disposRestants);
    } catch (err) {
      console.error("Erreur chargement réservations :", err);
      setCreneauxDispo(creneaux);
    }
  };





  if (loading) return <p>Chargement...</p>;
  if (!artisan) return <p>Artisan introuvable 😢</p>;

  return (
    <div style={{ padding: "1rem", margin:"100px 0"  }}>
      <Link to="/artisans">
        <button style={{ marginBottom: "1rem" }}>← Retour à la liste</button>
      </Link>
      <h2>{artisan.nom}</h2>
      <p><strong>Métier :</strong> {artisan.métier}</p>
      <p><strong>Ville :</strong> {artisan.ville}</p>
      <p><strong>Téléphone :</strong> {artisan.téléphone}</p>
      <p><strong>Description :</strong> {artisan.description}</p>

      {artisan.photos && artisan.photos.length > 0 && (
        <div>
          <h3>Photos de ses interventions 📸</h3>
          <div className="galerie">
            {artisan.photos.map((photoUrl, index) => (
              <div key={index} className="galerie-item">
                <img
                  src={`http://localhost:5000${photoUrl}`} // ✅ comme avant
                  alt={`Photo ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}


      <hr />

      <h3>Avis des clients ⭐</h3>
      <p><strong>Note moyenne :</strong> {moyenne ? `${moyenne} / 5` : "Pas encore noté"}</p>

      {avis.length === 0 ? (
        <p>Aucun avis pour l’instant...</p>
      ) : (
        avis.map((a) => (
          <div key={a._id} className="card">
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
            <Calendar
              onChange={chargerCreneaux}
              value={selectedDate}
              tileDisabled={({ date }) => {
                const nomJour = getNomJour(date);

                const today = new Date();
                today.setHours(0, 0, 0, 0); // 🔒 on ignore l’heure

                return (
                  date <= today || // ❌ date passée ou aujourd’hui
                  !artisan.disponibilites.some(d => d.jour === nomJour) // ❌ jour non dispo
                );
              }}

            />

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
                        onClick={() => {
                          const year = selectedDate.getFullYear();
                          const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                          const day = String(selectedDate.getDate()).padStart(2, "0");

                          const dateStr = `${year}-${month}-${day}`;
                          setFormData({
                            ...formData,
                            date_rdv: `${dateStr}T${c}`
                          });
                        }}


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
            <p>Veuillez indiquer des coordonnées valables car l'artisan vous contactera dans les 24 heures pour confirmer la résérvation. S'il ne parvient pas a vous joindre votre résérvation sera annulée.</p>
            <input
              type="text"
              name="nom_client"
              placeholder="Votre nom et prénom"
              value={formData.nom_client}
              onChange={handleChange}
              required
            /><br />

            <input
              type="email"
              name="email_client"
              placeholder="Votre email*"
              value={formData.email_client}
              onChange={handleChange}
              required
            />
            <br />

            <input
              type="tel"
              name="telephone_client"
              placeholder="Votre numéro de téléphone*"
              value={formData.telephone_client}
              onChange={handleChange}
              required
            /><br />


            <input
              type="datetime-local"
              name="date_rdv"
              value={formData.date_rdv}
              onChange={handleChange}
              required
            /><br />

            <textarea
              name="message"
              placeholder="Votre message (optionnel)"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <p>*Champs obligatoire.</p>
            {success && <p style={{ color: "green" }}>✅ Demande envoyée ! </p>}
            <button type="submit">Envoyer la demande</button>
          </form>
        </>
      )}


    </div>
  );
}

export default ArtisanDetail;
