import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default function Scene() {
 const host = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const element=host.current; if(!element) return;
  let renderer: THREE.WebGLRenderer;
  try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'}); } catch {return;}
  const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(36,1,.1,100); camera.position.set(0,1,9.5); camera.lookAt(0,0,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,window.innerWidth<768?1.25:1.75)); renderer.setClearColor(0xffffff,0); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.4;
  element.appendChild(renderer.domElement);
  const ambient=new THREE.HemisphereLight(0xffffff,0x4b6690,3);scene.add(ambient);
  const key=new THREE.DirectionalLight(0xffffff,6);key.position.set(-3,5,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0x89fff1,4);rim.position.set(4,2,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0x6a9cff,2);fill.position.set(-4,-2,3);scene.add(fill);
  const group=new THREE.Group();scene.add(group); group.rotation.set(.18,-.4,-.16);
  const blue=new THREE.MeshPhysicalMaterial({color:0x0755ed,metalness:.28,roughness:.24,clearcoat:.7});
  const teal=new THREE.MeshPhysicalMaterial({color:0x16c6a5,metalness:.22,roughness:.22,clearcoat:.8});
  const pearl=new THREE.MeshPhysicalMaterial({color:0xe4edf8,metalness:.35,roughness:.25});
  const navy=new THREE.MeshPhysicalMaterial({color:0x163c72,metalness:.45,roughness:.3});
  const core=new THREE.Mesh(new RoundedBoxGeometry(2.05,2.05,.9,5,.27),blue);core.rotation.set(.12,.15,.1);group.add(core);
  // An abstract inset circuit motif, kept separate from the approved company logo.
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.57,.035,12,64),pearl);ring.position.set(0,0,.49);core.add(ring);
  const center=new THREE.Mesh(new RoundedBoxGeometry(.58,.58,.14,4,.12),teal);center.position.z=.54;center.rotation.z=Math.PI/4;core.add(center);
  const nodes:THREE.Mesh[]=[];
  [[-1.9,-1,.15],[1.65,1.5,-.2],[1.85,-1.2,.4]].forEach((p,i)=>{const mesh=new THREE.Mesh(new RoundedBoxGeometry(.85,.85,.65,4,.17),i===2?pearl:teal);mesh.position.set(...p as [number,number,number]);mesh.rotation.set(.2,-.25,.12);group.add(mesh);nodes.push(mesh); const inset=new THREE.Mesh(new THREE.TorusGeometry(.2,.025,8,32),i===2?blue:pearl);inset.position.z=.34;mesh.add(inset);});
  const paths:THREE.TubeGeometry[]=[];
  for(let i=0;i<2;i++){const pts=[];for(let j=0;j<=100;j++){const a=j/100*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*2.45,Math.sin(a)*1.65,Math.sin(a+i*2)*.65));}const curve=new THREE.CatmullRomCurve3(pts);const geometry=new THREE.TubeGeometry(curve,100,.012,6,false);paths.push(geometry);const orbit=new THREE.Mesh(geometry,i?pearl:navy);orbit.rotation.z=i?.65:-.45;group.add(orbit);}
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.14,20,20),blue);ball.position.set(-1.1,1.9,.4);group.add(ball);
  const size=()=>{const {width,height}=element.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}; const resize=new ResizeObserver(size);resize.observe(element);size();
  let visible=true,frame=0,elapsed=0,last=0;const pointer={x:0,y:0};const fine=matchMedia('(pointer:fine)').matches;
  const move=(e:PointerEvent)=>{if(!fine)return;const r=element.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*.18;pointer.y=((e.clientY-r.top)/r.height-.5)*.12;}; const leave=()=>{pointer.x=0;pointer.y=0;};element.addEventListener('pointermove',move);element.addEventListener('pointerleave',leave);
  const render=(time:number)=>{frame=0;if(!visible||document.hidden)return;elapsed+=last?Math.min(time-last,50)/1000:0;last=time;group.rotation.y+=(-.4+pointer.x+Math.sin(elapsed*.23)*.07-group.rotation.y)*.035;group.rotation.x+=(.18+pointer.y-group.rotation.x)*.035;group.position.y=Math.sin(elapsed*.7)*.055;nodes.forEach((n,i)=>{n.rotation.z=.12+Math.sin(elapsed*.5+i)*.07;});renderer.render(scene,camera);element.classList.add('scene-ready');frame=requestAnimationFrame(render);};
  const start=()=>{if(visible&&!document.hidden&&!frame){last=0;frame=requestAnimationFrame(render);}};const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else start();});observer.observe(element);const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();};document.addEventListener('visibilitychange',visibility);
  const lost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;visible=false;element.classList.remove('scene-ready');};renderer.domElement.addEventListener('webglcontextlost',lost);start();
  return ()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',visibility);element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});[blue,teal,pearl,navy].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();element.classList.remove('scene-ready');};
 },[]);
 return <div className="scene-canvas" ref={host}/>;
}
