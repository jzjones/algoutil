import {
  generateAccount,
} from "algosdk";

export function createAccounts(n: number) {
  const accounts = [];
  for (let i = 0; i < n; i++) {
    accounts.push(generateAccount());
  }
  return accounts;
}