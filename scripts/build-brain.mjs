// Rebuild the lightweight point cloud from BodyParts3D CC BY 4.0 source meshes.
// Source/attribution: public/brain-attribution.txt. No source mesh ships to clients.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const cache = join(tmpdir(), 'antventure-brain-source');
await mkdir(cache, { recursive: true });
const tree = await (await fetch('https://api.github.com/repos/ssrpw2/brain-atlas/git/trees/c20c30e9c4628b9d129ecf061ff8cce99f358490?recursive=1')).json();
const names = tree.tree.filter(f => /^brain_obj\/(.*gyrus|.*lobule|occipital_lobe|cerebellum|pons|medulla_oblongata)_FJ\d+\.obj$/.test(f.path));
const triangles = []; let total = 0;
const min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
for (const file of names) {
  const local = join(cache,file.path.split('/').pop());
  let source;
  try { source = await readFile(local,'utf8'); } catch {
    const response = await fetch(`https://raw.githubusercontent.com/ssrpw2/brain-atlas/${tree.sha}/${file.path}`);
    if (!response.ok) throw new Error(`Download failed: ${file.path}`);
    source = await response.text(); await writeFile(local,source);
  }
  const vertices = [];
  for (const line of source.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'v') {
      const p = [Number(parts[2]),Number(parts[3]),Number(parts[1])];
      vertices.push(p);
      p.forEach((v,j) => { min[j]=Math.min(min[j],v); max[j]=Math.max(max[j],v); });
    }
    if (parts[0] === 'f') {
      const ids = parts.slice(1).map(p => Number(p.split('/')[0])-1);
      for(let j=1;j<ids.length-1;j++) {
        const a=vertices[ids[0]],b=vertices[ids[j]],c=vertices[ids[j+1]];
        const u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]);
        const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
        const length=Math.hypot(...n); if(length<1e-9)continue;
        total+=length/2; triangles.push({a,b,c,n:n.map(v=>v/length),area:total});
      }
    }
  }
}
let seed=8472;
const random=()=> { seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296; };
const center=min.map((v,i)=>(v+max[i])/2), scale=4.4/Math.max(...max.map((v,i)=>v-min[i]));
// Keep the visible lateral cortex instead of letting far-side/internal surfaces
// shine through it. This is an offline visibility bake, not a per-frame pass.
const resolution=768, depth=new Float32Array(resolution*resolution).fill(-Infinity);
const project=p=>[(p[0]-min[0])/(max[0]-min[0])*(resolution-1),(p[1]-min[1])/(max[1]-min[1])*(resolution-1)];
for(const {a,b,c} of triangles){
  const A=project(a),B=project(b),C=project(c);
  const den=(B[1]-C[1])*(A[0]-C[0])+(C[0]-B[0])*(A[1]-C[1]);
  if(Math.abs(den)<.0001)continue;
  const x0=Math.max(0,Math.floor(Math.min(A[0],B[0],C[0]))),x1=Math.min(resolution-1,Math.ceil(Math.max(A[0],B[0],C[0])));
  const y0=Math.max(0,Math.floor(Math.min(A[1],B[1],C[1]))),y1=Math.min(resolution-1,Math.ceil(Math.max(A[1],B[1],C[1])));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const u=((B[1]-C[1])*(x-C[0])+(C[0]-B[0])*(y-C[1]))/den;
    const v=((C[1]-A[1])*(x-C[0])+(A[0]-C[0])*(y-C[1]))/den;
    if(u>=-.02&&v>=-.02&&u+v<=1.02)depth[y*resolution+x]=Math.max(depth[y*resolution+x],u*a[2]+v*b[2]+(1-u-v)*c[2]);
  }
}
const points=[];
while(points.length<30000*6) {
  const pick=random()*total;let lo=0,hi=triangles.length-1;
  while(lo<hi){const m=(lo+hi)>>1;if(triangles[m].area<pick)lo=m+1;else hi=m;}
  const {a,b,c,n}=triangles[lo],u=Math.sqrt(random()),v=random();
  const raw=a.map((a,j)=>(1-u)*a+u*(1-v)*b[j]+u*v*c[j]);
  const pixel=project(raw);
  if(raw[2]<depth[Math.round(pixel[1])*resolution+Math.round(pixel[0])]-.6)continue;
  const p=raw.map((v,j)=>(v-center[j])*scale);
  points.push(...p.map(v=>Math.round(v*10000)),...n.map(v=>Math.round(v*10000)));
}
await writeFile('src/lib/brain-points.json',JSON.stringify(points));
console.log({files:names.length,triangles:triangles.length,bounds:[min,max],bytes:JSON.stringify(points).length,sourceCommit:tree.sha});
