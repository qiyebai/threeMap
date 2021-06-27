<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader';

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
      this.camera.position.z = 1;
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
      const material = new Three.MeshLambertMaterial({ color: '#fff', side: Three.DoubleSide });
      const loader = new VTKLoader();
      loader.load('./images/bunny.vtk', (geometry) => {
        geometry.computeVertexNormals();
        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(-0.075, 0.005, 0);
        this.scene.add(mesh);
        // geometry.center();
        // geometry.computeVertexNormals();

        // const mesh = new Three.Mesh(geometry, material);
        // mesh.position.set(-0.075, 0.005, 0);
        // mesh.scale.multiplyScalar(0.2);
        // this.scene.add(mesh);
      });
    },
    lightInit() {
      const light = new Three.DirectionalLight('#fff');
      light.position.set(200, 200, 1000).normalize();
      this.scene.add(light);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
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
