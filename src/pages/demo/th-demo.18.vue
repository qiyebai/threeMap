<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from '../../threeControl';

export default {
  data() {
    return {
      data_object: {},
    };
  },
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
      this.geometryInit(); // 物体
      this.planeInit();
      this.renderer.clear();
      this.lightInit(); // 光源
      this.renderRun(); // 渲染过程
      setTimeout(() => {
        this.show();
      }, 1000 * 5);
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 30;
      this.camera.position.y = 30;
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 锯齿感
        side: THREE.DoubleSide,
        skinning: true,
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
    geometryInit() { // 物体
      const manager = new THREE.LoadingManager();
      const objLoader = new OBJLoader(manager);
      const _this = this;
      objLoader.load('./images/sgwe.obj', (object) => {
        _this.data_object = object;
      });
      const manager1 = new THREE.LoadingManager();
      const textureLoader = new THREE.TextureLoader(manager1);
      this.data_texture = textureLoader.load('./images/5131_ShuSheng_D_1024.png');
    },
    lightInit() {
      const light1 = new THREE.AmbientLight(0xffffff);
      this.scene.add(light1);
    },
    show() {
      this.data_object.traverse((child) => {
        debugger;
        child.children.forEach((item) => {
          debugger;
          if (item.isMesh) item.material.map = this.data_texture;
        });
      });
      this.scene.add(this.data_object);
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
