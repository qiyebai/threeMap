<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PlaneBufferGeometry } from 'three';

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.mouse = new Three.Vector2();
      this.raycaster = new Three.Raycaster();

      this.height = 600;
      this.rota = 0;
      this.radius = 100;
      this.width = 1200;
      this.INTERSECTED = null;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.geometryInit(); // 物体
      this.lightInit(); // 光源
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new Three.Scene();
    },
    cameraInit() { // 相机
      this.camera = new Three.PerspectiveCamera(75, 2 / 1, 0.1, 1000);
      this.camera.position.z = 300;
      this.camera.position.y = 300;
      this.camera.lookAt(this.scene.position);
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new Three.WebGLRenderer({
        antialias: true, // 锯齿感
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor('#fff');
      container.appendChild(this.renderer.domElement);
    },
    geometryInit() { // 物体
      const parent = new Three.Object3D();
      const grid = new Three.Points(new Three.PlaneBufferGeometry(1500, 1500, 64, 64), new Three.PointsMaterial({
        color: 'blue',
        size: 2,
      }));
      parent.add(grid);
      parent.rotateX(Math.PI * 0.5);
      parent.position.y = -100;
      this.scene.add(parent);
      const manager = new Three.LoadingManager();
      const objLoader = new OBJLoader(manager);
      objLoader.load('./images/male02.obj', (object) => {
        const meterial = new Three.PointsMaterial({
          color: 'blue',
          size: 2,
        });
        object.traverse((child) => {
          if (child instanceof Three.Mesh) {
            const mepoint = new Three.Points(child.geometry, meterial);
            this.scene.add(mepoint);
          }
        });
      });
    },
    combineBuffer(model, bufferName) {
      let count = 0;
      model.traverse(function (child) {
        if (child.isMesh) {
          const buffer = child.geometry.attributes[bufferName];
          count += buffer.array.length;
        }
      });
      const combined = new Float32Array(count);
      let offset = 0;
      model.traverse(function (child) {
        if (child.isMesh) {
          const buffer = child.geometry.attributes[bufferName];
          combined.set(buffer.array, offset);
          offset += buffer.array.length;
        }
      });
      return new THREE.BufferAttribute(combined, 3);
    },
    createMesh(orginGeometry, scence, scale, x, y, z, color, dynamic) {
      const vertices = orginGeometry.vertices;
      const v1 = vertices.length;
    },
    lightInit() {
      const light = new Three.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1).normalize();
      this.scene.add(light);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.rota += 0.01;
      // this.mesh2.rotateY(0.1);
      // this.group.rotateY(0.1);
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style lang="less" scoped>
.content{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.three{
  height: 600px;
  width: 1200px;
  border:1px solid red;
}
</style>
