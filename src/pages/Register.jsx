import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    métier: "",
    ville: "",
    téléphone: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/artisans/register", formData);
      alert("Inscription réussie !");
    } catch (err) {
      console.error("Erreur inscription :", err);
      alert("Erreur, email déjà utilisé ?");
    }
  };

  return (
    <div>
      <h2>Créer un compte artisan 👷‍♂️</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required /><br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
        <input type="password" name="mot_de_passe" placeholder="Mot de passe" onChange={handleChange} required /><br />
        <input type="text" name="métier" placeholder="Métier" onChange={handleChange} required /><br />
        <input type="text" name="ville" placeholder="Ville" onChange={handleChange} /><br />
        <input type="text" name="téléphone" placeholder="Téléphone" onChange={handleChange} /><br />
        <textarea name="description" placeholder="Description" onChange={handleChange}></textarea><br />
        <button type="submit">S’inscrire</button>
      </form>
    </div>
  );
}

export default Register;
