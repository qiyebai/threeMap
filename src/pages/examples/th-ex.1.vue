<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { Clock, OrbitControls, CSS2DRenderer } from '../../threeControl';

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.height = 600;
      this.width = 1200;
      this.earthRadius = 1;
      this.moonRadius = 0.27;
      this.clock = new Clock();
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.lightInit();
      this.geometryInit(); // 物体
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.set(10, 5, 2);
      new OrbitControls(this.camera, document.getElementById('container'));
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 锯齿感
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor('#fff');
      container.appendChild(this.renderer.domElement);

      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(this.width, this.height);
      container.appendChild(this.labelRenderer.domElement);
    },
    lightInit() {
      const dirLight = new THREE.DirectionalLight(0xffffff);
      dirLight.position.set(0, 0, 1);
      this.scene.add(dirLight);
    },
    geometryInit() { // 物体
      // 坐标轴
      this.scene.add(new THREE.AxesHelper(10));
      const textureLoader = new THREE.TextureLoader();
      // 地球
      const earthGeometry = new THREE.SphereBufferGeometry(this.earthRadius, 16, 16);
      const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load('textures/planets/2049.png'),
        transparent: true,
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      this.scene.add(earth);
      // 月球
      const moonGeometry = new THREE.SphereBufferGeometry(this.moonRadius, 16, 16);
      const moonMaterial = new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load('textures/planets/moon_1024.jpg'),
      });
      this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
      this.scene.add(this.moon);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.renderer.render(this.scene, this.camera);
      const elapsed = this.clock.getElapsedTime();
      this.moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
      this.labelRenderer.render(this.scene, this.camera);
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
