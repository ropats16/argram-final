import { split, map, trim } from "ramda";
import { createTransaction, signTransaction } from 'permawebjs/transaction';
import Arweave from 'arweave';
import fs from 'fs';
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { getAddress } from "permawebjs/wallet";

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// const SRC = "j9Lk3cTmukZS2-hae9GYxK1CuHtWtHcA1V5-tkIfu5k";

const SRC = "rpS7iRgOIRKaxpi8PDsL3qnI8GGies29K4i6ep3UdJs"

const toArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend", (e) => {
      resolve(e.target.result);
    });
  });

export async function deployPermawebJS(asset) {
  const data = await toArrayBuffer(asset.file);
  const addr = await window.arweaveWallet.getActiveAddress();
  // const key = JSON.parse(fs.readFileSync('wallet.json').toString());
  // const addr = await getAddress({ key: key, environment: 'mainnet' });

  let assetType = asset.file.type.split('/')[0] || 'image'
  if (assetType === 'application') {
    assetType = asset.file.type.split('/')[1]
  }

  const inputTags = [
    { name: 'App-Name', value: 'SmartWeaveContract' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Content-Type', value: asset.file.type },
    { name: 'Contract-Src', value: SRC },
    {
      name: 'Init-State', value: JSON.stringify({
        creator: addr,
        ticker: "AGRAM-ASSET",
        balances: {
          [addr]: 10000
        },
        contentType: asset.file.type,
        comments: [],
      })
    },
    { name: 'Creator', value: addr },
    { name: 'Title', value: asset.title },
    { name: 'Description', value: asset.description },
    { name: 'Type', value: assetType },
  ];

  map(trim, split(',', asset.topics)).forEach(t => {
    inputTags.push({ name: 'Topic' + t, value: t });
  });
  //await warp.register(tx.id, "node2");

  const transaction = await createTransaction({ data, type: 'data', environment: 'mainnet', options: { tags: inputTags, signAndPost: true } });

  console.log("This is the result of posting from PermawebJS", transaction);

  // if (result.status === 400) {
  //   throw new Error('Not enough $AR in wallet to upload pst!');
  // } else if (result.status === 200) {
  //   return result;
  // } else {
  //   throw new Error(result.message + ' while trying to upload!')
  // }
}

export async function deployAr(asset) {
  const data = await toArrayBuffer(asset.file);
  const addr = await window.arweaveWallet.getActiveAddress();

  const tx = await arweave.createTransaction({ data })
  tx.addTag('App-Name', 'SmartWeaveContract')
  tx.addTag('App-Version', '0.3.0')
  tx.addTag('Content-Type', asset.file.type)

  tx.addTag('Contract-Src', SRC)
  tx.addTag('Init-State', JSON.stringify({
    creator: addr,
    ticker: "AGRAM-ASSET",
    balances: {
      [addr]: 10000
    },
    contentType: asset.file.type,
    comments: [],
  }))
  tx.addTag('Creator', addr)
  tx.addTag('Title', asset.title)
  tx.addTag('Description', asset.description)
  let assetType = asset.file.type.split('/')[0] || 'image'
  if (assetType === 'application') {
    assetType = asset.file.type.split('/')[1]
  }
  tx.addTag('Type', assetType)

  map(trim, split(',', asset.topics)).forEach(t => {
    tx.addTag('Topic:' + t, t)
  })

  await arweave.transactions.sign(tx)
  const result = await arweave.transactions.post(tx)

  console.log("This is the result of the deploy", result)

  // const { contractTxId } = await warp.register(tx.id, 'node2');
  // console.log(`Check the data: https://arweave.net/${contractTxId}`);

  if (result.status === 400) {
    throw new Error('Not enough $AR in wallet to upload pst!')
  } else if (result.status === 200) {
    console.log("Transaction with Arweave successful", tx);
    return tx
  }
  throw new Error(result.data + ' while trying to upload!')
}