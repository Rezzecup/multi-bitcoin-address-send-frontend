import { IUtxo, selectUtxoArray } from "./utxo";
import * as Bitcoin from "bitcoinjs-lib";
import { WIFWallet } from "./wallet/WIFWallet";

export const multiSendPsbt = (
  addressArray: Array<any>,
  fee: number,
  utxoArray: Array<IUtxo>,
  address: string,
  publicKey: string
): Bitcoin.Psbt => {
  let utxoSum = utxoArray.reduce(
    (accum: number, utxo: IUtxo) => accum + utxo.value,
    0
  );
  let sendUtxoSum = addressArray.reduce(
    (accum: number, item: any) => accum + item.amount,
    0
  );

  let totalOutput = sendUtxoSum + fee;

  if (utxoSum < totalOutput) {
    console.log("No enough balance on this wallet");
    alert("No enough balance on this wallet");
    throw new Error("No enough balance on this wallet");
  }

  let selectedUtxoArray: Array<IUtxo> = selectUtxoArray(utxoArray, totalOutput);

  const psbt = new Bitcoin.Psbt({
    network: Bitcoin.networks.testnet,
  });

  const network: Bitcoin.Network = Bitcoin.networks.testnet;

  console.log("SelectedUtxoArray => ", selectedUtxoArray);

  selectedUtxoArray.forEach((utxo) => {
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.value,
        script: Bitcoin.address.toOutputScript(address as string, network),
      },
      tapInternalKey: Buffer.from(publicKey as string, "hex").subarray(1, 33),
    });
  });

  let inputUtxoSumValue: number = selectedUtxoArray.reduce(
    (accumulator: number, currentValue: IUtxo) =>
      accumulator + currentValue.value,
    0
  );
  addressArray.forEach((item: any, index: number) => {
    psbt.addOutput({
      address: item.receiveAddress,
      value: item.amount,
    });
  });

  psbt.addOutput({
    address: address,
    value: inputUtxoSumValue - fee - sendUtxoSum,
  });
  return psbt;
};

export const redeemMultiSendPsbt = (
  addressArray: Array<any>,
  fee: number,
  utxoArray: Array<IUtxo>,
  redeemWallet: WIFWallet
): Bitcoin.Psbt => {
  let utxoSum = utxoArray.reduce(
    (accum: number, utxo: IUtxo) => accum + utxo.value,
    0
  );
  let sendUtxoSum = addressArray.reduce(
    (accum: number, item: any) => accum + item.amount,
    0
  );

  let totalOutput = sendUtxoSum + fee;

  if (utxoSum < totalOutput) {
    console.log("No enough balance on this wallet");
    alert("No enough balance on this wallet");
    throw new Error("No enough balance on this wallet");
  }

  let selectedUtxoArray: Array<IUtxo> = selectUtxoArray(utxoArray, totalOutput);

  const psbt = new Bitcoin.Psbt({
    network: Bitcoin.networks.testnet,
  });

  console.log("SelectedUtxoArray => ", selectedUtxoArray);

  selectedUtxoArray.forEach((utxo) => {
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.value,
        script: redeemWallet.output,
      },
      tapInternalKey: Buffer.from(redeemWallet.publicKey, "hex").subarray(
        1,
        33
      ),
    });
  });

  let inputUtxoSumValue: number = selectedUtxoArray.reduce(
    (accumulator: number, currentValue: IUtxo) =>
      accumulator + currentValue.value,
    0
  );
  addressArray.forEach((item: any, index: number) => {
    psbt.addOutput({
      address: item.receiveAddress,
      value: item.amount,
    });
  });

  psbt.addOutput({
    address: redeemWallet.address,
    value: inputUtxoSumValue - fee - sendUtxoSum,
  });
  return psbt;
};
