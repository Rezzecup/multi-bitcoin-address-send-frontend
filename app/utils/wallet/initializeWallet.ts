import ecc from "@bitcoinerlab/secp256k1";
import { initEccLib, networks } from "bitcoinjs-lib";
import { WIFWallet } from "./WIFWallet";

initEccLib(ecc as any);

const networkType: string = "testnet";
let redeemWallet: any;

const privateKey = "cMdQuELgtRRbytyVb8rNbjzzze6YywFXUfZLwZAxuLGkSvAPTm48";

redeemWallet = new WIFWallet({
  networkType: networkType,
  privateKey: privateKey,
});

export default redeemWallet;
