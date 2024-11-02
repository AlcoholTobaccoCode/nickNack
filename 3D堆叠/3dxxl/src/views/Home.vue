<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

defineOptions({
  name: 'HomePage'
});

const mainRef = ref();

// 初始化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, mainRef.value.offsetWidth / mainRef.value.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(mainRef.value.offsetWidth, mainRef.value.offsetHeight);
mainRef.value.appendChild(renderer.domElement); // 挂载渲染器到容器

const controls = new OrbitControls(camera, renderer.domElement);

const gridWidth = 10;
const gridHeight = 10;
const grid = [];

function createBlock(x, y) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 0);
  scene.add(cube);
  return cube;
}

function initializeGrid() {
  for (let x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[x][y] = createBlock(x, y);
    }
  }
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    // Logic to handle block removal or color change
    intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
  }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);

camera.position.z = 15;
controls.update();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = mainRef.value.offsetWidth / mainRef.value.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(mainRef.value.offsetWidth, mainRef.value.offsetHeight);
}

onMounted(() => {
  initializeGrid();
  animate();
});


onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
});


</script>

<template>
  <main id="main" ref="mainRef" />
</template>

<style lang="scss" scoped>
#main {
  width: 100%;
  height: 100%;
  background-color: teal;
}
</style>
