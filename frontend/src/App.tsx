import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ServicesPage from "./components/ServicesPage";
import AppointmentsPage from "./components/AppointmentsPage";
import ExamsPage from "./components/ExamsPage";
import PetsPage from "./components/PetsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/servicios" element={<ServicesPage />} />
                  <Route path="/citas" element={<AppointmentsPage />} />
                  <Route path="/examenes" element={<ExamsPage />} />
                  <Route path="/mascotas" element={<PetsPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
