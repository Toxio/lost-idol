import assert from 'node:assert/strict';
import { build } from 'esbuild';
let slots, cursor, pending, dirty, now, timers, nextId;
const same = (a,b) => a && b && a.length === b.length && a.every((v,i) => Object.is(v,b[i]));
globalThis.hooks = {
 useState(initial) { const i=cursor++; slots[i] ??= {value: typeof initial === 'function' ? initial() : initial}; return [slots[i].value, value => { const next=typeof value==='function'?value(slots[i].value):value; if(!Object.is(next,slots[i].value)){slots[i].value=next;dirty=true;} }]; },
 useRef(value) { const i=cursor++; slots[i] ??= {current:value}; return slots[i]; },
 useCallback(fn,deps) { const i=cursor++; if(!same(slots[i]?.deps,deps)) slots[i]={deps,value:fn}; return slots[i].value; },
 useEffect(fn,deps) { const i=cursor++; if(!same(slots[i]?.deps,deps)){ const prev=slots[i]; slots[i]={deps}; pending.push(()=>{prev?.cleanup?.();slots[i].cleanup=fn();}); } },
};
globalThis.window={setTimeout(fn,ms){const id=++nextId;timers.set(id,{fn,time:now+ms});return id;},clearTimeout(id){timers.delete(id);}};
const compiled=await build({entryPoints:['src/hooks/useAutoplay.ts'],bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'hooks',setup(b){b.onResolve({filter:/^react$/},()=>({path:'react',namespace:'mock'}));b.onResolve({filter:/useScreenWakeLock$/},()=>({path:'wake',namespace:'mock'}));b.onLoad({filter:/.*/,namespace:'mock'},a=>({contents:a.path==='wake'?'export const useScreenWakeLock = () => {};':'export const {useState,useRef,useCallback,useEffect}=globalThis.hooks;',loader:'js'}));}}]});
const {useAutoplay}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
let props,api,spins;
function render(){do{dirty=false;cursor=0;pending=[];api=useAutoplay(props);pending.forEach(fn=>fn());}while(dirty);}
function reset(){slots=[];now=0;timers=new Map();nextId=0;spins=0;props={spinning:false,status:'ready',winAmount:0,winLines:[],betAmount:2,cannotAffordBet:false,connectionLost:false,spin:()=>{spins++;},onSpinSpeedChange:()=>{},showInsufficientFunds:()=>{}};render();}
function tick(ms){const end=now+ms;for(;;){const entry=[...timers.entries()].sort((a,b)=>a[1].time-b[1].time)[0];if(!entry||entry[1].time>end)break;now=entry[1].time;timers.delete(entry[0]);entry[1].fn();render();}now=end;}
function start(extra={}){api.start({count:10,stopAfterWin:false,stopOnWinAmount:null,stopOnLossAmount:null,...extra});render();tick(300);}
function finish(win=0){props={...props,spinning:true};render();props={...props,spinning:false,winAmount:win};render();tick(500);}
reset();start();props={...props,spinning:true,treasuryTriggered:true};render();tick(6000);assert.equal(spins,1);assert.equal(api.autoPickBonus,true);props={...props,treasuryTriggered:false};finish();assert.equal(spins,2);
reset();start({stopOnTreasury:true});props={...props,treasuryTriggered:true,spinning:true};render();tick(1);assert.equal(api.autoSpin,false);assert.equal(api.autoPickBonus,false);
reset();start({stopOnFreeSpins:true});props={...props,treasuryTriggered:true,spinning:true};render();tick(1);assert.equal(api.autoPickBonus,true);props={...props,freeSpinsTriggered:true};render();tick(1);assert.equal(api.autoSpin,false);
reset();start({count:1});assert.equal(api.autoPickBonus,true);finish();assert.equal(spins,1);assert.equal(api.autoSpin,false);
reset();start({count:0});for(let i=0;i<12;i++)finish();assert.equal(spins,13);assert.equal(api.autoSpinRemaining,null);api.stop();render();tick(1000);assert.equal(spins,13);
reset();start({lossMultiplier:10});for(let i=0;i<10;i++)finish();assert.equal(spins,10);assert.equal(api.autoSpin,false);
reset();start({winMultiplier:50});finish(100);assert.equal(spins,1);assert.equal(api.autoSpin,false);
reset();api.start({count:10,stopAfterWin:false,stopOnWinAmount:null,stopOnLossAmount:null});render();api.stop();render();tick(1000);assert.equal(spins,0);
console.log('Autoplay: independent bonus stops, automatic Treasury, final spin, infinite rounds, loss/win limits and pending cancellation passed.');
