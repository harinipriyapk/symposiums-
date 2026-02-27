import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Success from "./pages/Success";
import Events from "./pages/Events";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/success" element={<Success />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </div>
  );
}

export default App;