// imports
import { split, map, trim } from "ramda";
import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import { createAndPostTransactionWOthent } from "permawebjs/transaction";

// transaction id of contract source
// const SRC = "Rx4qbEJuJ0kscCabQw9NQf3bo56C9nu2ce8z--GjViA" // debugger latest
const SRC = "0amEJwWCVlAKcepy-abdYJHxuYxGZyxSQIw7MX6UtGU" // tester

// function to convert input image to type `ArrayBuffer`
// takes in image file
const toArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend", (evt) => {
      resolve(evt.target.result);
    });
  });

// intiating new warp instance for mainnet
const warp = WarpFactory.forMainnet().use(new DeployPlugin());

// function to post asset to network using othent as authentication
// takes in 'asset' information
export async function postWOthent(asset) {

  // converts file to `ArrayBuffer`
  const data = await toArrayBuffer(asset.file);

  // array of input tags
  const inputTags = [
    { name: "Content-Type", value: asset.file.type },
    { name: "App-Name", value: "SmartWeaveContract" },
    { name: "App-Version", value: "0.3.0" },
    { name: "Contract-Src", value: SRC },
    {
      name: "Init-State",
      value: JSON.stringify({
        creator: asset.userid,
        ticker: "ARGRAM-ASSET",
        balances: {
          [asset.userid]: 10000
        },
        contentType: asset.file.type,
        comments: [],
        likes: {},
      }),
    },
    { name: 'Creator-Name', value: asset.username },
    { name: 'Creator', value: asset.userid },
    { name: 'Title', value: asset.title },
    { name: 'Description', value: asset.description },
    { name: 'Type', value: 'image' },
  ];

  // adding hashtags passed in by users to the 'inputTags' array
  map(trim, split(',', asset.topics)).forEach(t => {
    inputTags.push({ name: 'Topic:' + t, value: t });
  });

  // function call to create post referencing the contract source
  const transaction = await createAndPostTransactionWOthent({
    othentFunction: 'uploadData',
    data: data,
    tags: inputTags,
    useBundlr: true
  });

  // registering transaction with warp
  const { contractTxId } = await warp.register(transaction.transactionId, 'node1');

  console.log("Othent Arweave Txn Res", contractTxId);

  // returns the success status and transaction id of the post
  return transaction;
}