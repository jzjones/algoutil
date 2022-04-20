import { Algodv2 } from "algosdk";

export default function client() {
  const algodToken = process.env.ALGOD_TOKEN;
  const algodServer = process.env.ALGOD_SERVER;
  const algodAuthHeader = process.env.ALGOD_AUTH_HEADER;
  const algodPort = process.env.ALGOD_PORT;

  let authKey = {};
  if (algodAuthHeader && algodToken) {
    authKey = {
      [algodAuthHeader]: algodToken
    }
  }

  return new Algodv2(
    authKey,
    algodServer,
    algodPort
  );
}