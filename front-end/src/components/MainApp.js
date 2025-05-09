import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import GenerateImagePage from "./GenerateImagePage";
import CreatorDashboard from "./CreatorDashboard";
import FundPage from "./images/FundPage";
import axios from "axios";
import "./MainApp.css"; // Import the CSS

// Google Fonts import (for demo; for production, add to public/index.html)
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

function MainApp() {
  const [publicKey, setPublicKey] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      // Fetch public key from backend using email
      console.log('fetching public key');
      axios
        .get(`http://localhost:2000/public-key?email=${email}`)
        .then((res) => {
          setPublicKey(res.data.wallet_address);
          localStorage.setItem("public_key", res.data.wallet_address);
          console.log("Public key:", res.data.wallet_address);
          // Now fetch balance using the public key
          return axios.get(
            `http://localhost:2000/balance?publicKey=${res.data.wallet_address}`
          );
        })
        .then((res) => setWalletBalance(res.data.balance))
        .catch(() => setWalletBalance("Error"));
    }
  }, []);

  return (
    <div className="App-header">
      {/* Wallet info in top right */}
      <div className="wallet-info-topright">
        <div>
          <strong>Wallet Address:</strong> {publicKey || "N/A"}
        </div>
        <div>
          <strong>Balance:</strong>{" "}
          {walletBalance !== null ? walletBalance : "Loading..."} <span>XHIBIT</span>
        </div>
      </div>
      {/* Navbar always visible */}
      <nav className="navbar-xhibit">
        <Link to="generate">Generate Image</Link>
        <Link to="dashboard">Creator Dashboard</Link>
        <Link to="fund">Subscribe</Link>
      </nav>
      {/* Routed content below */}
      <div className="main-content">
        <Routes>
          <Route path="generate" element={<GenerateImagePage />} />
          <Route path="dashboard" element={<CreatorDashboard />} />
          <Route path="" element={<GenerateImagePage />} />
          <Route path="fund" element={<FundPage/>} />
        </Routes>
      </div>
    </div>
  );
}

export default MainApp;
