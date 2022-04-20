import {
  Account,
  Algodv2,
  makePaymentTxnWithSuggestedParamsFromObject,
  waitForConfirmation
} from "algosdk";

import {
  SignedTransactionData
} from "./types";
import client from "./client";

export async function sendTxn(algodClient: Algodv2, signedTxn: SignedTransactionData) {
  const pendingTxn = await algodClient.sendRawTransaction(signedTxn).do();

  const confirmedTxn = await waitForConfirmation(algodClient, pendingTxn.txId, 4);

  return confirmedTxn;
}

export async function getSuggestedParams() {
  return await client().getTransactionParams().do();
}

export async function pay(from: Account, to: string, amount: number) {
  const transactionParams = await client().getTransactionParams().do();
  const unsignedTxn = makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams: transactionParams,
    to,
    from: from.addr,
    amount
  });

  const signedTxn = unsignedTxn.signTxn(from.sk);

  const confirmedTxn = await sendTxn(client(), signedTxn);

  return confirmedTxn;
}