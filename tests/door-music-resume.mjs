import assert from 'node:assert/strict';
import { build } from 'esbuild';
globalThis.document = { hidden: false, addEventListener() {} };
const instances = [];
globalThis.__doorTest = instances;
const result = await build({entryPoints:['src/audio/soundManager.ts'],bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'audio-mocks',setup(b){
 b.onResolve({filter:/^howler$/},()=>({path:'howler',namespace:'mock'}));
 b.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:`export const Howler={mute(){}}; export class Howl {constructor(config){this.config=config;this.active=false;globalThis.__doorTest.push(this);} play(){this.active=true;return 1;} playing(){return this.active;} unload(){this.active=false;} stop(){this.active=false;} volume(){} once(){} off(){} state(){return "loaded";} seek(value){if(value!==undefined)this.position=value;return this.position??0;} }`}));
 b.onResolve({filter:/\.(mp3|wav|ogg)$/},a=>({path:a.path,namespace:'asset'}));
 b.onLoad({filter:/.*/,namespace:'asset'},a=>({contents:`export default ${JSON.stringify(a.path)}`}));
}}]});
const audio = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const active = name => instances.some(h=>h.active && h.config.src.some(src=>src.includes(name)));
for(const track of ['bonus_game','main']) {
 audio.setBackgroundMusic(track);
 audio.continueBonusDoorSound();
 assert.ok(!active(`${track}.mp3`));
 audio.stop('bonus_door');
 assert.ok(active(`${track}.mp3`), `${track} resumes after skipping doors`);
 audio.stop('bonus_door');
 assert.equal(instances.filter(h=>h.active).length,1,'Repeated stop must not duplicate music');
}
audio.stopBackgroundMusic();
audio.continueBonusDoorSound();
audio.stop('bonus_door');
assert.equal(instances.filter(h=>h.active).length,0,'Do not start unrequested background music');
console.log('Door skip: bonus and base music resume, no duplicates or unwanted restart.');

audio.setBackgroundMusic('main');
audio.startAnticipationMusic();
assert.ok(active('bonus_game.mp3'));
assert.ok(!active('main.mp3'));
assert.equal(instances.findLast(h => h.active).position, 12);
audio.stopAnticipationMusic();
assert.ok(active('main.mp3'));
audio.startAnticipationMusic();
audio.continueBonusDoorSound();
audio.stopAnticipationMusic();
assert.ok(active('bonus_door.mp3'), 'Ending anticipation must not interrupt the door transition');
audio.stop('bonus_door');
assert.ok(active('main.mp3'));
console.log('Anticipation reuses bonus music at 12 seconds and safely restores the background.');
