import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { WarpFactory } from 'warp-contracts';
import { getAddress } from 'permawebjs/wallet';
import Arweave from 'arweave';

import fs from 'fs';
import path from 'path';
import { createTransaction } from 'permawebjs/transaction';


const warp = WarpFactory.forMainnet().use(new DeployPlugin());

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

const __dirname = path.resolve();

const key = JSON.parse(fs.readFileSync('wallet.json').toString());

const contractSource = fs.readFileSync('src/contracts/handle.js', 'utf-8');
const addr = await getAddress({ key, environment: 'mainnet' });

const tx = await arweave.createTransaction({ data: contractSource });
tx.addTag('App-Name', 'SmartWeaveContract');
tx.addTag('App-Version', '0.3.0');
tx.addTag('Content-Type', 'application/javascript');

await arweave.transactions.sign(tx, key);
const result = await arweave.transactions.post(tx);

// await warp.register(tx.id, "node2");

if (result.status === 400) {
  throw new Error('Not enough $AR in wallet to upload pst!');
} else if (result.status === 200) {
  console.log("Txn uploaded successfully", tx);
} else {
  throw new Error(result.statusText + ' while trying to upload!');
}

// id: 'rpS7iRgOIRKaxpi8PDsL3qnI8GGies29K4i6ep3UdJs' => PermawebJS txn

// id: 'FnypXbwkNPEoZWZRW4UW0NGEudQk0D1kXArpMRSfV14' => Arweave txn



/* after the contract is deployed, write the function id to a local file */
// fs.writeFileSync('./src/utils/functionId.js', `export const functionId = "${data.id}"`);


