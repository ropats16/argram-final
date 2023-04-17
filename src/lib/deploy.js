import { split, map, trim } from "ramda";
import { createTransaction } from 'permawebjs/transaction';
import { writeContract } from 'permawebjs/contract';
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

// const SRC = "j9Lk3cTmukZS2-hae9GYxK1CuHtWtHcA1V5-tkIfu5k";

// const SRC = "CKmCX9XX9Dde7qO4pW48jUxFlloEeARzqM89pTI3TnQ" // PermawebJS 1.0.55

// const SRC = "jEdfetcqnAB_CAzRynrH9p0ekFIIlmaBmXqtJEwZKaE" // PermawebJS 1.0.55 w Comment

const SRC = "jEdfetcqnAB_CAzRynrH9p0ekFIIlmaBmXqtJEwZKaE"

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
        ticker: "ARGRAM-ASSET",
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

  console.log("We have asset topics", asset.topics);

  map(trim, split(',', asset.topics)).forEach(t => {
    inputTags.push({ name: 'Topic:' + t, value: t });
  });

  console.log("These are input tags", inputTags);

  const transaction = await createTransaction({ data, type: 'data', environment: 'mainnet', options: { tags: inputTags, signAndPost: true } });

  // await warp.register(transaction.transaction.id, 'node2');

  console.log("This is the result of posting from PermawebJS", transaction);

  if (transaction.postedTransaction.status === 400) {
    throw new Error('Not enough $AR in wallet to upload pst!');
  } else if (transaction.postedTransaction.status === 200) {
    return transaction;
  } else {
    throw new Error(transaction.postedTransaction.statusText + ' while trying to upload!')
  }
}

export async function passComment(comment) {
  // data needed
  // contract id
  // writer address
  // writer comment

  // use permawebJS write function
  const writeComment = await writeContract({ environment: 'mainnet', contractTxId: comment.id, wallet: 'use_wallet', options: { function: 'addComment', comment: comment.text, user: await window.arweaveWallet.getActiveAddress() } });

  return writeComment;
}