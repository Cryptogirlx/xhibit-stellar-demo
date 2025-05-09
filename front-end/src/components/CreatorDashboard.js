import React, { useState, useEffect } from "react"; // Import React and hooks for state and lifecycle management
import axios from "axios"; // Import axios for making HTTP requests
import './CreatorDashboard.css';

function CreatorDashboard() {
  // State to store the total earnings of the creator
  const [earnings, setEarnings] = useState(0);
  const [lookbookTitle, setLookbookTitle] = useState("");
  const [lookbooks, setLookbooks] = useState([]);
  // State to store the status message after requesting payout
  const [status, setStatus] = useState("");
  const [payoutStatus, setPayoutStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [ipHash, setIpHash] = useState("");
  const [lookbookIds, setLookbookIds] = useState([]);
  const [lookbookEarnings, setLookbookEarnings] = useState([]);

  // Replace with actual creator public key or fetch from context/localStorage
  const creatorId = localStorage.getItem("public_key");
  console.log("creatorId", creatorId);

  // Fetch earnings and lookbooks on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch lookbook IDs for this wallet
        if (creatorId) {
          const lookbooksRes = await axios.get(`http://localhost:2000/lookbooks/${creatorId}`);
          setLookbookIds(lookbooksRes.data.lookbookIds);

          // Fetch earnings for this wallet
          const earningsRes = await axios.get(`http://localhost:2000/lookbook/earnings/${creatorId}`);
          setEarnings(earningsRes.data.totalEarnings || 0);

          // Fetch detailed earnings per lookbook
          const detailsRes = await axios.get(`http://localhost:2000/lookbook/earnings/details/${creatorId}`);
          setLookbookEarnings(detailsRes.data.lookbooks || []);
        }
      } catch (err) {
        // setStatus("Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [creatorId]);

  // Handle lookbook creation
  const handleCreateLookbook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:2000/create-lookbook", {
        userWallet: creatorId,
        title: lookbookTitle,
        description,
        ipHash,
      });
      setLookbooks([...lookbooks, res.data.lookbook]);
      setLookbookTitle("");
      setDescription("");
      setIpHash("");
      setStatus("Lookbook created!");
    } catch (err) {
      setStatus("Error creating lookbook");
    }
    console.log('lookbook added');
  };

  // Handle payout request
  const handlePayout = async () => {
    try {
      const res = await axios.post("/payout/request", {
        creator_id: creatorId,
        amount: earnings,
      });
      setStatus(`Payout requested: ${res.data.amount}`);
      setPayoutStatus("pending");
    } catch (err) {
      setStatus("Error requesting payout");
    }
  };

  if (loading) return <div>Loading...</div>;

  // Render the dashboard UI
  return (
    <div className="creator-dashboard-main">
      <div className="dashboard-card">
        <h3>Create Lookbook</h3>
        <form onSubmit={handleCreateLookbook} className="dashboard-section">
          <label>
            <span className="dashboard-label">Lookbook Title:</span>
            <input
              type="text"
              value={lookbookTitle}
              onChange={(e) => setLookbookTitle(e.target.value)}
              placeholder="Lookbook title"
              required
            />
          </label>
          <label>
            <span className="dashboard-label">Description:</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </label>
          <label>
            <span className="dashboard-label">IPFS Hash:</span>
            <input
              type="text"
              value={ipHash}
              onChange={(e) => setIpHash(e.target.value)}
              placeholder="IPFS Hash"
              required
            />
          </label>
          <button type="submit" className="dashboard-button">Create</button>
        </form>
        {status && <div className="status-message">{status}</div>}
      </div>
      <div className="dashboard-card">
        <h2>Creator Stats</h2>
        <div className="dashboard-section dashboard-total-earnings">
          <span className="total-earnings-label">Total Earnings</span>
          <div className="total-earnings-amount">
            {earnings}
          </div>
          <div className="total-earnings-token">
            XHIBIT
          </div>
          <div className="total-earnings-separator"></div>
        </div>
        <div className="dashboard-section">
          <span className="total-earnings-label">Earnings per lookbook</span>
          {lookbookEarnings.length > 0 ? (
            <ul className="lookbook-earnings-list">
              {lookbookEarnings.map((lb) => (
                <li key={lb.lookbookId} className="lookbook-earnings-item">
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <span className="lookbook-id">ID: {lb.lookbookId}</span>
                    <span className="lookbook-earning">{lb.earnings} XHIBIT</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <span>None</span>
          )}
        </div>
        <button onClick={handlePayout}>Request Payout</button>
      </div>
    </div>
  );
}

export default CreatorDashboard; // Export the component for use in other parts of the app
