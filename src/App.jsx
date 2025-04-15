import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Artisans from "./pages/Artisans";
import ArtisanDetail from "./pages/ArtisanDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfilArtisan from "./pages/ProfilArtisan";
import MesReservations from "./pages/MesReservations";
import JeSuisArtisan from "./pages/JeSuisArtisan";
import About from "./pages/About";
import AvisRdv from "./pages/AvisRdv";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:id" element={<ArtisanDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<ProfilArtisan />} />
        <Route path="/mes-reservations" element={<MesReservations />} />      
        <Route path="/artisan" element={<JeSuisArtisan />} />
        <Route path="/about" element={<About />} />
        <Route path="/avis/:id" element={<AvisRdv />} />

      </Routes>
    </Router>
  );
}

export default App;
