import { readFileSync } from "fs";
import { ABIContract, ABIMethod } from "algosdk";

export function loadABIContract(specFile: string): ABIContract {
  return new ABIContract(JSON.parse(readFileSync(specFile).toString()));
}

export function getMethodByName(name: string, contract: ABIContract): ABIMethod {
  const m = contract.methods.find((mt: ABIMethod)=>{ return mt.name==name })
  if(m === undefined)
      throw Error("Method undefined: "+name)
  return m;
}