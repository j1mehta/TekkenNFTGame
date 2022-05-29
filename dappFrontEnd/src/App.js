import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import twitterLogo from './assets/twitter-logo.svg';

// Import the two things that our frontend need to interact with our deployed contract.
// Follow the below steps if you ever change your deployed contract:
// 1. Deploy it again.
// 2. Update the contract address on our frontend (copy/paste from console log).
// 3. Update the abi file on our frontend (copy/paste from artifacts folder).
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import IronFistTournament from "./utils/IronFistTournament.json"

import {ethers} from "ethers";

// Constants
const TWITTER_HANDLE = 'j1mehta';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        console.log('No of accounts found: ' + accounts.length + " and the list is: " + accounts);

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4') {
        alert("Please connect to Rinkeby!")
      }
    } catch(error) {
      console.log(error)
    }
  }

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // useEffect(() => {
  //   checkNetwork();
  // }, [currentAccount]);

  useEffect( () => {

    const fetchNFTMetadata = async () => {
      console.log('Looking for your character NFT on address: ' + currentAccount);
    }
    //Provider are nodes provided by Metamsk to talk to Ethereum nodes
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //Signer is an abstraction of an Ethereum account for signing messages/txns and send signed txns
    //to the Etereum Network that execute state changing operations
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        IronFistTournament.abi,
        signer
    )

    const txn = gameContract.checkIfUserHasNft();
    if (txn.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log('No character NFT found');
    }


    /*
   * We only want to run this, if we have a connected wallet
   */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }

  }, [currentAccount])


  const renderContent = () => {
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
          <div className="connect-wallet-container">
            <img
                src="https://64.media.tumblr.com/92ef00632c07eafe32554699f14002ad/8e6290f9102a76ac-d2/s540x810/444c3290f3ce94f922d9cb0930ac6405a93141a1.gifv"
                alt="Devil Jin"
            />
            <button
                className="cta-button connect-wallet-button"
                onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>
          </div>
      );
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };

  return (
      <div className="App">
        <div className="container">
          <div className="header-container">
            <p className="header gradient-text">TEKKEN</p>
            <p className="sub-text">Battle of the NFTs</p>
            <div className="connect-wallet-container">
              {renderContent()}
          </div>
          <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </div>
      </div>
  );
};

export default App;