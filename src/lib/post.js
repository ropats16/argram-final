import { split, map, trim } from "ramda";
import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";

const SRC = "Rx4qbEJuJ0kscCabQw9NQf3bo56C9nu2ce8z--GjViA" // debugger latest

const toArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend", (evt) => {
      resolve(evt.target.result);
    });
  });

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

export async function postAsset(asset) {
  const data = await toArrayBuffer(asset.file);

  const inputTags = [
    { name: 'Creator-Name', value: asset.username },
    { name: 'Creator', value: asset.userid },
    { name: 'Title', value: asset.title },
    { name: 'Description', value: asset.description },
    { name: 'Type', value: 'image' },
  ];

  map(trim, split(',', asset.topics)).forEach(t => {
    inputTags.push({ name: 'Topic:' + t, value: t });
  });

  const { jwk } = await warp.generateWallet();

  const { contractTxId } = await warp.deployFromSourceTx({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify({
      creator: asset.userid,
      ticker: "ARGRAM-ASSET",
      balances: {
        [asset.userid]: 10000
      },
      contentType: asset.file.type,
      comments: [],
      likes: {},
    }),
    srcTxId: SRC,
    data: { 'Content-Type': asset.file.type, body: data },
    tags: inputTags,
  });

  console.log("This is the contract tx id", contractTxId);

  return contractTxId;
}