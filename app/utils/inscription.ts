// [src/utils/inscription.ts]
import { type Network } from "bitcoinjs-lib";
import { testnet } from "bitcoinjs-lib/src/networks";

export interface IInscription {
  address: string;
  inscriptionId: string;
  inscriptionNumber: number,
  output: string,
  outputValue: number,
}

export const getInscriptions = async (
  address: string,
  network: Network
): Promise<IInscription[]> => {
  const basePath = network === testnet ? "testnet/" : "";
  const url = `/${basePath}wallet-api-v4/address/inscriptions?address=${address}&cursor=0&size=100`;
  console.log("Requesting URL:", url); // Log the URL being requested

  const res = await fetch(url);
  const text = await res.text(); // First get the response as text to check what's coming back
  console.log("Server response:", text); // Log the raw response text

  try {
    const inscriptionDatas = JSON.parse(text); // Try to parse the text as JSON
    const inscriptions: IInscription[] = [];
    inscriptionDatas.result.list.forEach((inscriptionData: any) => {
      inscriptions.push({
        address: inscriptionData.address,
        inscriptionId: inscriptionData.inscriptionId,
        inscriptionNumber: inscriptionData.inscriptionNumber,
        output: inscriptionData.output,
        outputValue: inscriptionData.outputValue,
      });
    });

    return inscriptions;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error; // Rethrow to handle it in the component if needed
  }
};
