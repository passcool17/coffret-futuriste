import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url),release='rings-26758d5';
test('normal entry selects versioned app, content, scene and ring graphics throughout browser graph',()=>{
 const html=fs.readFileSync(new URL('index.html',root),'utf8');
 const entry=html.match(/<script type="module" src="([^"]+)"/)[1];
 const base='https://example.test/coffret-futuriste/';
 const queue=[new URL(entry,base)],seen=new Set();
 while(queue.length){const url=queue.shift();if(seen.has(url.href))continue;seen.add(url.href);assert.equal(url.origin,'https://example.test');const file=url.pathname.replace('/coffret-futuriste/','');const source=fs.readFileSync(new URL(file,root),'utf8');
  if(['src/app.js','src/content.js','src/scene.js','src/ring-graphics.js'].includes(file))assert.equal(url.searchParams.get('v'),release,file+' must bypass old module URL');
  for(const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"](\.[^'"]+)['"]/g))queue.push(new URL(match[1],url));
 }
 for(const file of ['app','content','scene','ring-graphics'])assert.ok(seen.has(base+'src/'+file+'.js?v='+release));
 // Unchanged state/audio keep one canonical URL: no duplicate model or audio singleton.
 for(const file of ['model','audio','audio-events','control-focus']){const urls=[...seen].filter(u=>new URL(u).pathname.endsWith('/'+file+'.js'));assert.deepEqual(urls,[base+'src/'+file+'.js']);}
});
