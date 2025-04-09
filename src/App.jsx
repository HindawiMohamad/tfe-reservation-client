import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Artisans from "./pages/Artisans";
import ArtisanDetail from "./pages/ArtisanDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";import ProfilArtisan from "./pages/ProfilArtisan";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:id" element={<ArtisanDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<ProfilArtisan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
