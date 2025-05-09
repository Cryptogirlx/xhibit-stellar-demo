import React, { useState, useEffect } from 'react'; // Import React and the useState and useEffect hooks for state management
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'; // Import the CSS
import xhibitLogo from './images/xhibit-logo.png'; // Adjust filename if needed

function SignupPage() {
  // State to store the generated wallet address
  // const [wallet, setWallet] = useState('');
  const [email, setEmail] = useState(''); // State for email input
  const navigate = useNavigate();

  // Function to handle signup and wallet creation
  const handleSignup = async () => {
    try {
      console.log('signup');
      await axios.post('http://localhost:2000/', { email })
        .catch(err => {
          console.log('axios error', err);
          throw err;
        });
      console.log('local storage');
      localStorage.setItem('email', email);
      console.log('Navigating to /app');
      navigate('/app');
    } catch (error) {
      console.log('catch block', error);
      alert('Signup failed. Please try again.');
    }
  };

  // Function to handle login for existing users
  const handleLogin = async () => {
    try {
      // Encode the email to handle special characters
      const encodedEmail = encodeURIComponent(email);
      const response = await axios.get(`http://localhost:2000/user/wallet/${encodedEmail}`);
      
      if (response.data.success) {
        // Store the wallet address in localStorage
        localStorage.setItem('walletAddress', response.data.walletAddress);
        localStorage.setItem('email', email);
        navigate('/app');
      } else {
        alert('Login failed. Please check your email.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 404) {
        alert('User not found. Please check your email or sign up.');
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

  // useEffect(() => {
  //   const pubKey = localStorage.getItem('public_key');
  //   setWallet(pubKey);

  //   if (pubKey) {
  //     axios.get(`/wallet-balance?public_key=${pubKey}`)
  //       .then(res => {
  //         // Assuming you want to set walletBalance state
  //         // You might want to handle the response data differently based on your backend's response
  //         console.log('Wallet balance:', res.data.balance);
  //         // setWalletBalance(res.data.balance);
  //       })
  //       .catch(() => {
  //         console.error('Error fetching wallet balance');
  //         // setWalletBalance('Error');
  //       });
  //   }
  // }, []);

  // Render the signup page UI
  return (
    <div className="App-header">
      <div className="signup-container">
        {/* Xhibit Logo */}
        <img
          src={xhibitLogo}
          alt="Xhibit Logo"
          className="signup-logo"
        />
        <h2 className="signup-title">SIGNUP</h2>
        {/* Email input field */}
        <input
          type="email"
          className="signup-input"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {/* Button to trigger wallet creation */}
        <button className="signup-btn" onClick={handleSignup}>Create Wallet</button>
        <button className="login-btn" onClick={handleLogin}>Login</button>
        {/* Display the wallet address if it exists
        {wallet && <p className="signup-wallet">Wallet Address: {wallet}</p>} */}
      </div>
    </div>
  );
}

export default SignupPage; // Export the component for use in other parts of the app
