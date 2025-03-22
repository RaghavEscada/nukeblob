import './style.css';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils';
import vertexShader from './shaders/vertex.glsl';
import { Text } from 'troika-three-text';
import textVertex from './shaders/textVertex.glsl';
import gsap from 'gsap/all';

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);

const blobs = [
  {
    "name": "Strategy",
    "background": "#111144",
    "config": {
      "uPositionFrequency": 0.5,
      "uPositionStrength": 0.4,
      "uSmallWavePositionFrequency": 0.4,
      "uSmallWavePositionStrength": 0.6,
      "roughness": 0.5,
      "metalness": 0.5,
      "envMapIntensity": 1.3,
      "clearcoat": 0.2,
      "clearcoatRoughness": 0.4,
      "transmission": 0,
      "flatShading": false,
      "wireframe": false,
      "map": "cosmic-void"
    }
  },
  {
    "name": "Design",
    "background": "#FF5733",
    "config": {
      "uPositionFrequency": 0.7,
      "uPositionStrength": 0.5,
      "uSmallWavePositionFrequency": 0.8,
      "uSmallWavePositionStrength": 0.4,
      "roughness": 0.2,
      "metalness": 0.8,
      "envMapIntensity": 1.5,
      "clearcoat": 1,
      "clearcoatRoughness": 0.2,
      "transmission": 0,
      "flatShading": false,
      "wireframe": false,
      "map": "firestorm"
    }
  },
  {
    "name": "Digital",
    "background": "#00A3E1",
    "config": {
      "uPositionFrequency": 0.9,
      "uPositionStrength": 0.4,
      "uSmallWavePositionFrequency": 0.6,
      "uSmallWavePositionStrength": 0.7,
      "roughness": 0.1,
      "metalness": 0.9,
      "envMapIntensity": 1.8,
      "clearcoat": 0.5,
      "clearcoatRoughness": 0.3,
      "transmission": 0,
      "flatShading": false,
      "wireframe": false,
      "map": "electric-rush"
    }
  },
  {
    "name": "Brand",
    "background": "#FFA500",
    "config": {
      "uPositionFrequency": 0.6,
      "uPositionStrength": 0.6,
      "uSmallWavePositionFrequency": 0.7,
      "uSmallWavePositionStrength": 0.5,
      "roughness": 0.3,
      "metalness": 0.7,
      "envMapIntensity": 1.2,
      "clearcoat": 0.8,
      "clearcoatRoughness": 0.1,
      "transmission": 0,
      "flatShading": false,
      "wireframe": false,
      "map": "solar-burst"
    }
  },
  {
    "name": "Content",
    "background": "#32CD32",
    "config": {
      "uPositionFrequency": 0.8,
      "uPositionStrength": 0.4,
      "uSmallWavePositionFrequency": 0.4,
      "uSmallWavePositionStrength": 0.8,
      "roughness": 0.25,
      "metalness": 0.6,
      "envMapIntensity": 1,
      "clearcoat": 1,
      "clearcoatRoughness": 0.1,
      "transmission": 0,
      "flatShading": false,
      "wireframe": false,
      "map": "forest-glow"
    }
  },
  {
    "name": "Experience",
    "background": "#8B0000",
    "config": {
      "uPositionFrequency": 0.7,
      "uPositionStrength": 0.8,
      "uSmallWavePositionFrequency": 0.9,
      "uSmallWavePositionStrength": 0.6,
      "roughness": 0.6,
      "metalness": 0.3,
      "envMapIntensity": 1.7,
      "clearcoat": 0.7,
      "clearcoatRoughness": 0.2,
      "transmission": 0,
      "flatShading": false,
      "wireframe": false,
      "map": "magma-core"
    }
  },
  {
    "name": "Motion",
    "background": "#ADD8E6",
    "config": {
      "uPositionFrequency": 0.6,
      "uPositionStrength": 0.3,
      "uSmallWavePositionFrequency": 0.9,
      "uSmallWavePositionStrength": 0.5,
      "roughness": 0.15,
      "metalness": 0.9,
      "envMapIntensity": 1.4,
      "clearcoat": 1,
      "clearcoatRoughness": 0,
      "transmission": 0,
      "flatShading": false,
      "wireframe": false,
      "map": "ice-crystal"
    }
  },
  
]

let isAnimating = false;
let currentIndex = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#333');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas')
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const uniforms = {
  uTime: { value: 0 },
  uPositionFrequency: { value: blobs[currentIndex].config.uPositionFrequency },
  uPositionStrength: { value: blobs[currentIndex].config.uPositionStrength },
  uTimeFrequency: { value: .3 },
  uSmallWavePositionFrequency: { value: blobs[currentIndex].config.uSmallWavePositionFrequency },
  uSmallWavePositionStrength: { value: blobs[currentIndex].config.uSmallWavePositionStrength },
  uSmallWaveTimeFrequency: { value: .3 },
};

const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader,
  map: textureLoader.load(`./gradients/${blobs[currentIndex].config.map}.png`),
  metalness: blobs[currentIndex].config.metalness,
  roughness: blobs[currentIndex].config.roughness,
  envMapIntensity: blobs[currentIndex].config.envMapIntensity,
  clearcoat: blobs[currentIndex].config.clearcoat,
  clearcoatRoughness: blobs[currentIndex].config.clearcoatRoughness,
  transmission: blobs[currentIndex].config.transmission,
  flatShading: blobs[currentIndex].config.flatShading,
  wireframe: blobs[currentIndex].config.wireframe,
  uniforms,
});

const mergedGeometry = mergeVertices(new THREE.IcosahedronGeometry(1, 70));
mergedGeometry.computeTangents();

const sphere = new THREE.Mesh(mergedGeometry, material);
scene.add(sphere);

camera.position.z = 3;

rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

const textMaterial = new THREE.ShaderMaterial({
  fragmentShader: `void main() { gl_FragColor = vec4(1.0); }`,
  vertexShader: textVertex,
  side: THREE.DoubleSide,
  uniforms: {
    progress: { value: 0.0 },
    direction: { value: 1 },
  }
});

const texts = blobs.map((blob, index) => {
  const myText = new Text();
  myText.text = blob.name;
  myText.font = `./aften_screen.woff`;
  myText.anchorX = 'center';
  myText.anchorY = 'middle';
  myText.material = textMaterial;
  myText.position.set(0, 0, 2);
  if (index !== 0) myText.scale.set(0, 0, 0);
  myText.letterSpacing = -0.08;
  myText.fontSize = window.innerWidth / 4000;
  myText.glyphGeometryDetail = 20;
  myText.sync();
  scene.add(myText);
  return myText;
})

window.addEventListener('wheel', (e) => {
  if (isAnimating) return;
  isAnimating = true;
  let direction = Math.sign(e.deltaY);
  let next = (currentIndex + direction + blobs.length) % blobs.length;

  texts[next].scale.set(1, 1, 1);
  texts[next].position.x = direction * 3.5;

  gsap.to(textMaterial.uniforms.progress, {
    value: .5,
    duration: 1,
    ease: 'linear',
    onComplete: () => {
      currentIndex = next;
      isAnimating = false;
      textMaterial.uniforms.progress.value = 0;
    }
  })

  gsap.to(texts[currentIndex].position, {
    x: -direction * 3,
    duration: 1,
    ease: 'power2.inOut',
  })

  gsap.to(sphere.rotation, {
    y: sphere.rotation.y + Math.PI * 4 * -direction,
    duration: 1,
    ease: 'power2.inOut',
  })

  gsap.to(texts[next].position, {
    x: 0,
    duration: 1,
    ease: 'power2.inOut',
  })

  const bg = new THREE.Color(blobs[next].background);
  gsap.to(scene.background, {
    r: bg.r,
    g: bg.g,
    b: bg.b,
    duration: 1,
    ease: 'linear',
  })

  updateBlob(blobs[next].config);
})

function updateBlob(config) {
  if (config.uPositionFrequency !== undefined) gsap.to(material.uniforms.uPositionFrequency, { value: config.uPositionFrequency, duration: 1, ease: 'power2.inOut' });
  if (config.uPositionStrength !== undefined) gsap.to(material.uniforms.uPositionStrength, { value: config.uPositionStrength, duration: 1, ease: 'power2.inOut' });
  if (config.uSmallWavePositionFrequency !== undefined) gsap.to(material.uniforms.uSmallWavePositionFrequency, { value: config.uSmallWavePositionFrequency, duration: 1, ease: 'power2.inOut' });
  if (config.uSmallWavePositionStrength !== undefined) gsap.to(material.uniforms.uSmallWavePositionStrength, { value: config.uSmallWavePositionStrength, duration: 1, ease: 'power2.inOut' });
  if (config.uSmallWaveTimeFrequency !== undefined) gsap.to(material.uniforms.uSmallWaveTimeFrequency, { value: config.uSmallWaveTimeFrequency, duration: 1, ease: 'power2.inOut' });
  if (config.map !== undefined) {
    setTimeout(() => {
      material.map = textureLoader.load(`./gradients/${config.map}.png`);
    }, 400);
  }
  if (config.roughness !== undefined) gsap.to(material, { roughness: config.roughness, duration: 1, ease: 'power2.inOut' });
  if (config.metalness !== undefined) gsap.to(material, { metalness: config.metalness, duration: 1, ease: 'power2.inOut' });
  if (config.envMapIntensity !== undefined) gsap.to(material, { envMapIntensity: config.envMapIntensity, duration: 1, ease: 'power2.inOut' });
  if (config.clearcoat !== undefined) gsap.to(material, { clearcoat: config.clearcoat, duration: 1, ease: 'power2.inOut' });
  if (config.clearcoatRoughness !== undefined) gsap.to(material, { clearcoatRoughness: config.clearcoatRoughness, duration: 1, ease: 'power2.inOut' });
  if (config.transmission !== undefined) gsap.to(material, { transmission: config.transmission, duration: 1, ease: 'power2.inOut' });
  if (config.flatShading !== undefined) gsap.to(material, { flatShading: config.flatShading, duration: 1, ease: 'power2.inOut' });
  if (config.wireframe !== undefined) gsap.to(material, { wireframe: config.wireframe, duration: 1, ease: 'power2.inOut' });
}

loadingManager.onLoad = () => {
  function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  }
  const bg = new THREE.Color(blobs[currentIndex].background);
  gsap.to(scene.background, { r: bg.r, g: bg.g, b: bg.b, duration: 1, ease: 'linear' });
  animate();
};
