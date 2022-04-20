import util from "util";
import { exec } from "child_process";

import client from "./client";

const execAsync = util.promisify(exec);

export async function compileTeal(programSource: string) {
  const encoder = new util.TextEncoder();
  const programBytes = encoder.encode(programSource);
  const compileResponse = await client().compile(programBytes).do();
  const compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
  return compiledBytes;
}

export async function compilePyTeal(filename: string, params?: {[key: string]: string | number}) {
  const contractOutput = await execAsync(`python3 ${filename} '${JSON.stringify(params)}'`);
  const tealCode = contractOutput.stdout;
  const binaryCode = await compileTeal(tealCode);
  return binaryCode;
}
