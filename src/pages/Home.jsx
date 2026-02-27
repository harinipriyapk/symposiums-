import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <section className="home">
      <div className="overlay"></div>

      <div className="content">
        <h1 className="title">
          College Symposium 2026
        </h1>

        <p className="subtitle">
          Innovation • Technology • Excellence
        </p>

        <Link to="/register" className="cta-btn">
          Register Now
        </Link>
      </div>
    </section>
  );
};

export default Home;