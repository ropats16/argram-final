import { getAddress } from 'permawebjs/wallet';
import fs from 'fs';
import path from 'path';
import { createTransaction } from 'permawebjs/transaction';
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

const __dirname = path.resolve();

const key = JSON.parse(fs.readFileSync('wallet.json').toString());

const contractSource = fs.readFileSync('src/contracts/handle.js', 'utf-8');
const addr = await getAddress({ key, environment: 'mainnet' });

const inputTags = [
  { name: 'Content-Type', value: 'application/javascript' },
  {
    name: 'Init-State', value: JSON.stringify({
      creator: addr,
      owner: addr,
    })
  },
];

const tx = await createTransaction({ data: contractSource, key: key, environment: 'mainnet', type: 'data', options: { tags: inputTags, signAndPost: true } });

console.log("Transaction result for contract source with permawebJS", tx);

await warp.register(tx.transaction.id, "node2");

if (tx.postedTransaction.status === 400) {
  throw new Error('Not enough $AR in wallet to upload pst!');
} else if (tx.postedTransaction.status === 200) {
  console.log("Txn uploaded successfully", tx);
} else {
  throw new Error(tx.postedTransaction.statusText + ' while trying to upload!');
}

// id: 'rpS7iRgOIRKaxpi8PDsL3qnI8GGies29K4i6ep3UdJs' => PermawebJS txn

// id: '80UmfNuSj4dVUXgb1ZcarQxcNoZTdFQd8lO2AEDQFrU' => PermawebJS txn for new contractSource

// id: 'CKmCX9XX9Dde7qO4pW48jUxFlloEeARzqM89pTI3TnQ' => PermawebJS txn for new contractSource v2

// id: 'FnypXbwkNPEoZWZRW4UW0NGEudQk0D1kXArpMRSfV14' => Arweave txn


