import {
    makeAssetCreateTxnWithSuggestedParamsFromObject,
    makeAssetTransferTxnWithSuggestedParamsFromObject,
    Account,
} from "algosdk";

import client from "./client";
import { getSuggestedParams, sendTxn } from "./txn";

type ASAParams = {
  assetName: string,
  assetURL: string,
  assetMetadataHash: string,
  total: number,
  note?: Uint8Array,
  decimals: number,
  unitName: string,
  defaultFrozen: boolean,
  manager?: string,
  reserve?: string,
  clawback?: string,
  freeze?: string,
  rekeyTo?: string
}

export async function deployASA(creatorAccount: Account, params: ASAParams) {
  const transactionParams = await client().getTransactionParams().do();
  const unsignedTxn = makeAssetCreateTxnWithSuggestedParamsFromObject({
    suggestedParams: transactionParams,
    from: creatorAccount.addr,
    ...params,
  });

  const signedTxn = unsignedTxn.signTxn(creatorAccount.sk);

  const txnResponse = await sendTxn(client(), signedTxn);

  const assetId = txnResponse["asset-index"];

  return assetId;
}

export async function optIn(assetId: number, account: Account) {
  const transactionParams = await client().getTransactionParams().do();
  const unsignedTxn = makeAssetTransferTxnWithSuggestedParamsFromObject({
    suggestedParams: transactionParams,
    from: account.addr,
    to: account.addr,
    assetIndex: assetId,
    amount: 0
  });

  const signedTxn = unsignedTxn.signTxn(account.sk);

  await sendTxn(client(), signedTxn);
}

type SendASAProps = {
  from: Account,
  to: string,
  assetId: number,
  amount: number
}

export async function sendASA(props: SendASAProps) {
  const suggestedParams = await getSuggestedParams();
  const unsignedTxn = makeAssetTransferTxnWithSuggestedParamsFromObject({
    suggestedParams,
    from: props.from.addr,
    to: props.to,
    assetIndex: props.assetId,
    amount: props.amount,
  });
  const signedTxn = unsignedTxn.signTxn(props.from.sk);
  const result = await sendTxn(client(), signedTxn);
  return result;
}