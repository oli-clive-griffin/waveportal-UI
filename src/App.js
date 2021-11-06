import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x7A49b242bBc0D46231c3FdF896595F72b768e968";

  const contractABI = abi.abi;

  const [wavesCount, setWavesCount] = useState(0);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return
      } else {
        console.log("we have the ethereum object", ethereum);
      }
  
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("found an authorised account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (e) {
      console.log(e);
    } 
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWavesCount(count.toNumber())

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(async () => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img">👋</span> Hey there!
        </div>

        <div className="bio">
        I'm Oli and I'm building the future of farming in NZ!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        <p>Your current account is: {currentAccount}</p>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <p> waves: {wavesCount}</p>
 
      </div>
    </div>
  );
}

export default App;
