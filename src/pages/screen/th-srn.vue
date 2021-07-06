<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from '../../threeControl';

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.planeInit();
      this.lightInit(); // 光源
      this.tentaclesInit(); // 触须
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 300;
      this.camera.position.y = 300;
    },
    lightInit() {
      const light1 = new THREE.AmbientLight(0xffffff);
      this.scene.add(light1);
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 锯齿感
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor('#fff');
      container.appendChild(this.renderer.domElement);
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
    },
    planeInit() {
      const grid = new THREE.Points(new THREE.PlaneBufferGeometry(500, 500, 30, 30), new THREE.PointsMaterial({
        color: 'blue',
        size: 1,
      }));
      grid.rotateX(Math.PI * 0.5);
      grid.position.y = 0;
      const axesHelper = new THREE.AxesHelper(50);
      this.scene.add(grid);
      this.scene.add(axesHelper);
    },
    tentaclesInit() { // 触须
      const loca_length = 100;
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      for (let i = 0; i < loca_length; i++) {
        const phi = Math.acos(-1 + (2 * i) / loca_length);
        const theta = Math.sqrt(loca_length * Math.PI) * phi;
        const object = new THREE.Object3D();
        object.position.setFromSphericalCoords(100, phi, theta);
        const local_object = object.position.multiplyScalar(2);
        vertices.push(local_object.x, local_object.y, local_object.z);
        vertices.push(0, 0, 0);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const pointMaterial = new THREE.LineBasicMaterial({
        color: 'red', // 设置颜色，默认 0xFFFFFF
      });
      const points = new THREE.LineSegments(geometry, pointMaterial);
      // 将模型添加到场景
      this.scene.add(points);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.control.update();
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
