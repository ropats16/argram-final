import { Exm, ContractType } from '@execution-machine/sdk';
import fs from 'fs';
// import { createContract } from 'permawebjs/contract'

// const wallet_key = JSON.parse(readFileSync('wallet.json').toString());

// const initState = fs.readFileSync('./src/utils/state.js', 'utf-8');
const contractSource = fs.readFileSync('./src/utils/handle.js');

// const res = await createContract({
//   wallet: wallet_key,
//   initialState: initState,
//   contractSource: contractSource,
//   environment: 'local'
// });

const APIKEY = process.env.EXM_PK;
export const exmInstance = new Exm({ token: APIKEY });

const data = await exmInstance.functions.deploy(
  contractSource,
  {
    posts: {}
  },
  ContractType.JS,
)

console.log({ data });

/* after the contract is deployed, write the function id to a local file */
fs.writeFileSync('./src/utils/functionId.js', `export const functionId = "${data.id}"`);


