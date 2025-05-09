import React, { useState, useEffect } from 'react'; // Import React and the useState and useEffect hooks for state management
import axios from 'axios'; // Import axios for making HTTP requests
import './GenerateImage.css';
import fashionImage from './images/fashion.webp';

function GenerateImagePage() {
  const [lookbooks, setLookbooks] = useState([]);
  const [message, setMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState(''); // Add state for transaction hash

  useEffect(() => {
    // Fetch all lookbooks from the backend
    axios.get('http://localhost:2000/lookbooks') // Adjust endpoint as needed
      .then(res => setLookbooks(res.data.lookbooks))
      .catch(() => setLookbooks([]));
  }, []);

  // Function to handle the image generation process
  const handleGenerate = async (lookbookId) => {
    const senderWallet = localStorage.getItem('walletAddress');
    
    if (!senderWallet) {
      setMessage('Please connect your wallet first');
      return;
    }

    try {
      const res = await axios.post('http://localhost:2000/generate', { 
        lookbookId,
        senderWallet 
      });
      setMessage(res.data.message);
      setTransactionHash(res.data.transactionHash); // Store the transaction hash
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to generate image');
      setTransactionHash(''); // Clear transaction hash on error
    }
  };

  // Render the generate image page UI
  return (
    <div className="generate-container">
      <div className="cards-row">
        {lookbooks.map(lookbook => (
          <div className="lookbook-card-container" key={lookbook.id}>
            <div className="image-card">
              <div className="token-badge">10 XBT</div>
              <img src={fashionImage} alt="Generated" className="generated-image" />
              <div className="lookbook-title"><strong>{lookbook.title}</strong></div>
              <div className="lookbook-description">{lookbook.description}</div>
              <button className="generate-btn" onClick={() => handleGenerate(lookbook.id)}>
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Display the message and transaction hash if they exist */}
      {message && <p className="generate-message">{message}</p>}
      {transactionHash && (
        <p className="transaction-hash">
          Transaction Hash: <a 
            href={`https://stellar.expert/explorer/testnet/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionHash}
          </a>
        </p>
      )}
    </div>
  );
}

export default GenerateImagePage; 
