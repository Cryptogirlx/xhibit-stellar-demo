import React, { useState } from "react";
import axios from "axios";

const FundPage = () => {
  const [address, setAddress] = useState("");
  const [trustlineAddress, setTrustlineAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [trustlineLoading, setTrustlineLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [trustlineMessage, setTrustlineMessage] = useState("");

  const inputStyle = {
    padding: "5px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minWidth: "400px",
    fontFamily: "Montserrat, Inter, Poppins, Arial, sans-serif",
  };

  const buttonStyle = (loading) => ({
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: loading ? "not-allowed" : "pointer",
    minWidth: "160px",
  });

  const handleFund = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://localhost:2000/fund-account", { walletAddress: address });
      setMessage("Account funded successfully!");
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTrustline = async () => {
    setTrustlineLoading(true);
    setTrustlineMessage("");
    try {
      const response = await axios.post("http://localhost:2000/add-trustline", { walletSecret: trustlineAddress });
      setTrustlineMessage("Trustline established successfully!");
    } catch (error) {
      setTrustlineMessage("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setTrustlineLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        height: "38vh",
        width: "50vw",
        borderRadius: "12px",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        padding: "10px",
        fontFamily: "Montserrat, Inter, Poppins, Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2px" }}>
        <h3>Subcribe to Xhibit</h3>
      </div>
      <div style={{ display: "flex", gap: "4px", marginTop: "1px", fontSize: "18px" }}>
        <p>
          Mint test XHIBIT tokens to an address.
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        <input
          type="password"
          placeholder="Paste secret for trustline"
          value={trustlineAddress}
          onChange={(e) => setTrustlineAddress(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={handleTrustline}
          disabled={trustlineLoading}
          style={buttonStyle(trustlineLoading)}
        >
          {trustlineLoading ? "Establishing..." : "Establish Trustline"}
        </button>
      </div>
      {trustlineMessage && (
        <div style={{ marginTop: "16px", color: trustlineMessage.startsWith("Error") ? "red" : "green" }}>
          {trustlineMessage}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Paste address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={handleFund}
          disabled={loading}
          style={buttonStyle(loading)}
        >
          {loading ? "Loading..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <div style={{ marginTop: "16px", color: message.startsWith("Error") ? "red" : "green" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FundPage;
