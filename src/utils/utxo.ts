export interface IUtxo {
  txid: string;
  vout: number;
  value: number;
  fullTx?: string; // Optional property
}

export const selectUtxoArray = (
  utxoArray: Array<IUtxo>,
  amount: number
): Array<IUtxo> => {
  let newUtxoArray = [];
  let newUTXOAmount = 0;

  for (let i = 0; i < utxoArray.length; i++) {
    if (newUTXOAmount >= amount) {
      break;
    } else {
      newUtxoArray.push(utxoArray[i]);
      newUTXOAmount += newUtxoArray[i].value;
    }
  }

  return newUtxoArray;
};
