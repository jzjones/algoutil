import {
  Account,
  OnApplicationComplete,
  makeApplicationCreateTxnFromObject
} from "algosdk";

import client from "./client";
import { sendTxn } from "./txn";
import {
  ASCStorageSchema,
} from "./types";

export async function deployContract(approvalProgram: Uint8Array, clearProgram: Uint8Array, creatorAccount: Account, storageSchema: ASCStorageSchema) {
  const transactionParams = await client().getTransactionParams().do();
  const createApplicationTransaction = makeApplicationCreateTxnFromObject({
    suggestedParams: transactionParams,
    from: creatorAccount.addr,
    onComplete: OnApplicationComplete.NoOpOC,
    approvalProgram,
    clearProgram,
    ...storageSchema
  });

  const signedCreateTxn = createApplicationTransaction.signTxn(creatorAccount.sk);

  const txnResponse = await sendTxn(client(), signedCreateTxn);

  const appId = txnResponse["application-index"];

  return appId;
}

type AppGlobalState = {
  key: string,
  value: {
    bytes: string,
    type: number,
    uint: number
  }
}

export function parseAppState(globalState: AppGlobalState[]) {
  const stateObj: { [key: string]: Buffer | number | string } = {};
  for (const state of globalState) {
    let value: string | number;
    // byteslice
    if (state.value.type === 1) {
      value = Buffer.from(state.value.bytes, "base64").toString();
    }
    // uint
    else if (state.value.type === 2) {
      value = state.value.uint;
    }
    // not byteslice or uint
    else {
      throw new Error("State type is not defined");
    }
    const key = Buffer.from(state.key, "base64").toString()
    stateObj[key] = value;
  }
  return stateObj;
}