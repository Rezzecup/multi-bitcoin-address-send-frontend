import axios, { type AxiosError } from "axios";
import { networks, Network } from "bitcoinjs-lib";

const TESTNET = "testnet";

interface IUtxo {
  txid: string;
  vout: number;
  value: number;
}

// Function to fetch UTXOs for a given address from mempool.space
export const getUtxos = async (
  address: string,
  network: Network
): Promise<IUtxo[]> => {
  const networkPath = network === networks.testnet ? "testnet/" : ""; // Adjust API endpoint depending on network
  const url = `https://mempool.space/${networkPath}api/address/${address}/utxo`;
  try {
    const response = await axios.get(url);
    return response.data.map((utxo: any) => ({
      txid: utxo.txid,
      vout: utxo.vout,
      value: utxo.value,
    }));
  } catch (error) {
    console.error("Error fetching UTXOs:", error);
    throw error;
  }
};

export const pushBTCpmt = async (rawtx: any, networkType: string) => {
  const txid = await postData(
    `https://mempool.space/${networkType == TESTNET ? "testnet/" : ""}api/tx`,
    rawtx
  );
  return txid;
};

const postData = async (
  url: string,
  json: any,
  content_type = "text/plain",
  apikey = ""
): Promise<string | undefined> => {
  try {
    const headers: any = {};
    if (content_type) headers["Content-Type"] = content_type;
    if (apikey) headers["X-Api-Key"] = apikey;
    const res = await axios.post(url, json, {
      headers,
    });
    return res.data as string;
  } catch (err: any) {
    console.log("Push Transaction Error");
    console.log(err.response.data);
  }
};
