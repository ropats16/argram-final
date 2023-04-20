import { getAddress } from 'permawebjs/wallet';
import fs from 'fs';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { WarpFactory } from 'warp-contracts';
import path from 'path';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

const key = JSON.parse(fs.readFileSync('wallet.json').toString());

const __dirname = path.resolve();

console.log(path.join(__dirname, 'src/contracts/handle.js'));

const contractSource = fs.readFileSync(path.join(__dirname, 'src/contracts/handle.js'), 'utf-8');
const addr = await getAddress({ key, environment: 'mainnet' });

const newSource = await warp.createSource({ src: contractSource }, new ArweaveSigner(key));

const newSrcId = await warp.saveSource(newSource);

console.log("New Source Contract Id", newSrcId);


