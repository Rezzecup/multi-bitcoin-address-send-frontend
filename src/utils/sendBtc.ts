import {
  script,
  Psbt,
  initEccLib,
  networks,
  Signer as BTCSigner,
  crypto,
  opcodes,
  payments,
} from "bitcoinjs-lib";
import { ECPairFactory, ECPairAPI } from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";
import axios, { AxiosResponse } from "axios";
import { getUtxos, pushBTCpmt } from "./mempool";
import { multiSendPsbt, redeemMultiSendPsbt } from "./psbt";
import { IUtxo } from "./utxo";
import redeemWallet from "./wallet/initializeWallet";

const TESTNET = "testnet";

initEccLib(ecc as any);
declare const window: any;
const ECPair: ECPairAPI = ECPairFactory(ecc);
const network = networks.testnet;

export const sendBitcoin = async (
  publicKey: string,
  address: string,
  addressArray: Array<any>,
  feeRate: number
) => {
  try {
    let utxos: Array<IUtxo> = await getUtxos(address, network);
    utxos = utxos.filter((utxo) => utxo.value >= 10000);

    let fee = 100000;
    for (let i = 0; i < 3; i++) {
      let redeemPsbt: Psbt = redeemMultiSendPsbt(
        addressArray,
        fee,
        utxos,
        redeemWallet
      );

      redeemPsbt = redeemWallet.signPsbt(redeemPsbt, redeemWallet.ecPair);

      fee = redeemPsbt.extractTransaction(true).virtualSize() * feeRate;
    }
    let psbt: Psbt = multiSendPsbt(
      addressArray,
      fee,
      utxos,
      address,
      publicKey
    );

    let psbtHex: string = psbt.toHex();

    try {
      let res = await window.unisat.signPsbt(psbtHex, {
        autoFinalized: true,
        toSignInputs: psbt.txInputs.map((input, index) => {
          return {
            index: index,
            address: address,
          };
        }),
      });
      const signedPsbt: Psbt = Psbt.fromHex(res);

      const tx = signedPsbt.extractTransaction(true);
      const txHex = tx.toHex();

      //   Push transaction and getting transaction id
      const response = await pushBTCpmt(txHex, TESTNET);

      console.log("Pushed transaction Id => ", response);
      console.log(`https://mempool.space/testnet/tx/${response}`);

      alert(`Success: ${response}`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const blockstream = new axios.Axios({
  baseURL: `https://blockstream.info/testnet/api`,
});

export async function signAndSend(
  psbt: Psbt,
  publicKeyTemp: string,
  address: string
) {
  const publicKey = await window.unisat.getPublicKey();
  console.log("signed address => ", address);
  try {
    let res = await window.unisat.signPsbt(psbt.toHex(), {
      toSignInputs: [
        {
          index: 0,
          publicKey,
          disableTweakSigner: true,
        },
      ],
    });

    console.log("signed psbt", res);

    res = await window.unisat.pushPsbt(res);

    console.log("txid", res);
  } catch (e) {
    console.log(e);
  }
}

export async function broadcast(txHex: string) {
  const response: AxiosResponse<string> = await blockstream.post("/tx", txHex);
  return response.data;
}

function tapTweakHash(pubKey: Buffer, h: Buffer | undefined): Buffer {
  return crypto.taggedHash(
    "TapTweak",
    Buffer.concat(h ? [pubKey, h] : [pubKey])
  );
}

function toXOnly(pubkey: Buffer): Buffer {
  return pubkey.subarray(1, 33);
}

function tweakSigner(signer: BTCSigner, opts: any = {}): BTCSigner {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let privateKey: Uint8Array | undefined = signer.privateKey!;
  if (!privateKey) {
    throw new Error("Private key is required for tweaking signer!");
  }
  if (signer.publicKey[0] === 3) {
    privateKey = ecc.privateNegate(privateKey);
  }

  const tweakedPrivateKey = ecc.privateAdd(
    privateKey,
    tapTweakHash(toXOnly(signer.publicKey), opts.tweakHash)
  );
  if (!tweakedPrivateKey) {
    throw new Error("Invalid tweaked private key!");
  }

  return ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey), {
    network: opts.network,
  });
}
