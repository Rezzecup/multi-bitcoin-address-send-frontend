import React, { useEffect, useState, useRef } from "react";
import { networks, Network } from "bitcoinjs-lib";
import { sendBitcoin } from "../utils/sendBtc";

const ConnectWalletBtn = () => {
  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [addressArray, setAddressArray] = useState<any[]>([
    {
      receiveAddress:
        "tb1p37hue6fafalyu6s585vq7ultmxg75lx77y7ur5ydz437vwp5ntmq8xyvd2",
      amount: 20000,
    },
    {
      receiveAddress:
        "tb1p37hue6fafalyu6s585vq7ultmxg75lx77y7ur5ydz437vwp5ntmq8xyvd2",
      amount: 30000,
    },
    {
      receiveAddress:
        "tb1p37hue6fafalyu6s585vq7ultmxg75lx77y7ur5ydz437vwp5ntmq8xyvd2",
      amount: 40000,
    },
  ]);

  const [feeRate, setFeeRate] = useState<number>(300);

  const [network, setNetwork] = useState<Network>(networks.bitcoin); // Changed from string to Network type and default to bitcoin network

  // Check if UniSat is installed
  useEffect(() => {
    if (typeof window.unisat !== "undefined") {
      setUnisatInstalled(true);
    } else {
      setUnisatInstalled(false);
      console.warn("UniSat Wallet is not installed!");
    }
  }, []);

  const connectWallet = async () => {
    if (!unisatInstalled) {
      console.warn("Attempted to connect without UniSat Wallet installed.");
      return;
    }
    try {
      const result = await window.unisat.requestAccounts();
      if (result.length > 0) {
        setConnected(true);
        setAccounts(result);
        setAddress(result[0]);
        await fetchWalletDetails(result[0]);
      } else {
        setConnected(false);
      }
    } catch (error) {
      console.error("Error connecting to UniSat Wallet:", error);
    }
  };

  const fetchWalletDetails = async (accountAddress: string) => {
    const publicKey = await window.unisat.getPublicKey();
    const balance = await window.unisat.getBalance();
    const networkName = await window.unisat.getNetwork();
    const networkConfig =
      networkName === "testnet" ? networks.testnet : networks.bitcoin; // Adjusted to set the correct network configuration based on the name

    setPublicKey(publicKey);
    setBalance(balance);
    setNetwork(networkConfig); // Updated to use the network configuration object
  };

  // Within your ConnectWalletBtn.tsx or similar component
  const sendBitcoinClick = async () => {
    if (publicKey && address) {
      await sendBitcoin(publicKey, address, addressArray, feeRate);
    } else {
      console.warn("Public Key or Address missing!");
    }
  };

  const updateAddressList = async (address: string, index: number) => {
    if (publicKey && address) {
      let addressArrayTemp = addressArray;
      addressArrayTemp[index] = {
        ...addressArrayTemp[index],
        receiveAddress: address,
      };
      setAddressArray(addressArrayTemp);
      console.log(addressArrayTemp);
    } else {
      console.warn("Public Key or Address missing!");
    }
  };

  const changeValue = (e: any, index: number, type: string) => {
    if (publicKey && address) {
      let addressArrayTemp = addressArray;
      if (type == "address") {
        addressArrayTemp[index] = {
          ...addressArrayTemp[index],
          receiveAddress: e.target.value,
        };
      } else if (type == "amount") {
        addressArrayTemp[index] = {
          ...addressArrayTemp[index],
          amount: +e.target.value,
        };
      }
      updateAddressListValue(addressArrayTemp);
    } else {
      console.warn("Public Key or Address missing!");
    }
  };

  const updateAddressListValue = (data: any) => {
    if (publicKey && address) {
      setAddressArray(data);
    }
  };

  return (
    <div className="flex justify-center items-center w-[220px] px-[15px] pt-[18px] pb-[18px] rounded-[15px] border border-[#494459] gap-2 cursor-pointer">
      <div
        onClick={connectWallet}
        className="text-white font-League-Spartan text-[23px] cursor-pointer mt-2"
      >
        {connected ? (
          <div>
            <p>Address: {address}</p>
            <p>
              Network: {network === networks.bitcoin ? "bitcoin" : "testnet"}
            </p>{" "}
            {/* Adjusted to display the network name based on the network configuration */}
            <p>
              Balance: {balance.total} (Confirmed: {balance.confirmed},
              Unconfirmed: {balance.unconfirmed})
            </p>
            <p>Public Key: {publicKey}</p>
            {addressArray.map((item, index) => (
              <div
                style={{ display: "flex", marginBottom: "10px" }}
                key={index}
              >
                <p style={{ marginRight: "10px" }}>
                  Receiver Address {index} :
                </p>
                <input
                  type="text"
                  placeholder={"Receiver Address"}
                  style={{ marginRight: "50px" }}
                  defaultValue={item.receiveAddress}
                  onChange={(e) => changeValue(e, index, "address")}
                />
                <p style={{ marginRight: "10px" }}>Amount :</p>
                <input
                  type="number"
                  placeholder="20000"
                  style={{ marginRight: "10px" }}
                  defaultValue={item.amount}
                  onChange={(e) => changeValue(e, index, "amount")}
                />
                <p>sats</p>
              </div>
            ))}
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <p style={{ marginRight: "10px" }}>FeeRate :</p>
              <input
                type="number"
                placeholder="300"
                defaultValue={feeRate}
                style={{ marginRight: "10px" }}
                onChange={(e) => {
                  setFeeRate(+e.target.value);
                }}
              />
              <p>sat/vB</p>
            </div>
            <button onClick={sendBitcoinClick}>Send Bitcoin</button>
          </div>
        ) : (
          <button>Connect Wallet</button>
        )}
      </div>
    </div>
  );
};

export default ConnectWalletBtn;
