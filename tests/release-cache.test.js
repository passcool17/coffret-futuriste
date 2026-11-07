import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url),release='replay-bank-v1',markerRelease='ring-markers-v1';
test('normal entry selects one canonical versioned replay graph including model and physical atlas imports',()=>{
 const html=fs.readFileSync(new URL('index.html',root),'utf8');
 const entry=html.match(/<script type="module" src="([^"]+)"/)[1];
 const base='https://example.test/coffret-futuriste/';
 const css=html.match(/rel="stylesheet" href="([^"]+)"/)[1];assert.equal(new URL(css,base).searchParams.get('v'),release);
 const queue=[new URL(entry,base)],seen=new Set();
 while(queue.length){const url=queue.shift();if(seen.has(url.href))continue;seen.add(url.href);assert.equal(url.origin,'https://example.test');const file=url.pathname.replace('/coffret-futuriste/','');const source=fs.readFileSync(new URL(file,root),'utf8');
  if(['src/app.js','src/content.js','src/scene.js','src/ring-graphics.js','src/model.js','src/puzzles.js','src/selector.js','src/session-storage.js'].includes(file))assert.equal(url.searchParams.get('v'),['src/app.js','src/scene.js'].includes(file)?markerRelease:release,file+' must bypass old module URL');
  for(const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"](\.[^'"]+)['"]/g))queue.push(new URL(match[1],url));
 }
 for(const pathName of new Set([...seen].map(u=>new URL(u).pathname)))assert.equal([...seen].filter(u=>new URL(u).pathname===pathName).length,1,'one URL per shared module');
 for(const file of ['app','content','scene','ring-graphics','model','puzzles','selector','session-storage'])assert.ok(seen.has(base+'src/'+file+'.js?v='+(['app','scene'].includes(file)?markerRelease:release)));
 // Unchanged audio keeps one canonical URL; all changed modules are versioned.
 for(const file of ['audio','audio-events','control-focus']){const urls=[...seen].filter(u=>new URL(u).pathname.endsWith('/'+file+'.js'));assert.deepEqual(urls,[base+'src/'+file+'.js']);}
});
