import { useState } from "react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", mot_de_passe: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/artisans/login", formData);
      const { token, artisan } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("artisan", JSON.stringify(artisan));
      alert("Connexion réussie !");
      window.location.href = "/profil"; // redirige vers page profil
    } catch (err) {
      console.error("Erreur login :", err);
      alert("Identifiants incorrects !");
    }
  };

  return (
    <div>
      <h2>Connexion artisan 🔐</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
        <input type="password" name="mot_de_passe" placeholder="Mot de passe" onChange={handleChange} required /><br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
