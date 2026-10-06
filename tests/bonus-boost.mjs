import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {build} from 'esbuild';
const root='../math-sdk/games/lost_idol/library_treasury_single/calibrated_preview/';
const pool=async mode=>JSON.parse(gunzipSync(await readFile(`${root}${mode}.json.gz`)));
const [base,boost]=await Promise.all([pool('base'),pool('bonus_boost')]);
const mass=p=>p.entries.reduce((a,e)=>a+BigInt(e.weight),0n);
const eventMass=(p,type)=>p.entries.reduce((a,e)=>a+(e.book.events.some(x=>x.type===type)?BigInt(e.weight):0n),0n);
const m=mass(boost), moment=boost.entries.reduce((a,e)=>a+BigInt(e.weight)*BigInt(e.book.payoutMultiplier),0n);
assert.equal(moment,m*240n);
for(const type of ['treasury','freeSpinTrigger']) assert.equal(eventMass(boost,type)*mass(base),5n*eventMass(base,type)*m);
const result=await build({stdin:{contents:'export {createMockRgsClient} from "./src/api/rgs/mockClient";',resolveDir:process.cwd()},bundle:true,write:false,format:'esm',platform:'node',alias:{'@':'./src'},define:{'import.meta.env.DEV':'true'}});
const {createMockRgsClient}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
for(const stake of [10000,1000000,2500000]) {
 const storage=new Map();globalThis.sessionStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
 const book=boost.entries.find(e=>e.book.events.some(x=>x.type==='treasury')).book;
 globalThis.fetch=async url=>{assert.equal(url,'/__calibrated-math?mode=bonus_boost');return {ok:true,json:async()=>book};};
 const client=createMockRgsClient(); const start=await client.authenticate();const paid=await client.play({mode:'bonus_boost',amount:stake});
 assert.equal(paid.balance.amount,start.balance.amount-Math.round(stake*2.5));
 assert.equal(paid.round.amount,stake);
 const restored=createMockRgsClient();assert.equal((await restored.authenticate()).round.mode,'bonus_boost');
 const end=await restored.endRound();assert.equal(end.balance.amount,paid.balance.amount+Math.round(stake*book.payoutMultiplier/100));
 assert.equal((await restored.endRound()).balance.amount,end.balance.amount);
}
console.log('Boost: exact 96% RTP, both bonus odds increased fivefold, 2.5x debit, base-stake payout and reload settlement passed.');
