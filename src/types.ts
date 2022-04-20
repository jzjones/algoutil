export type SignedTransactionData = Uint8Array | Uint8Array[];

export type ASCStorageSchema = {
  numLocalInts: number,
  numGlobalByteSlices: number,
  numGlobalInts: number,
  numLocalByteSlices: number
}

export type ASCParams = {
  [key: string]: string | number
}

export type NetworkAccount = {
  name: string,
  address: string,
  mnemonic: string
}

export type AccountAsset = {
  amount: number,
  "asset-id": number,
  "is-frozen": boolean
}