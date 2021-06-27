<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';

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
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new Three.Scene();
    },
    cameraInit() { // 相机
      this.camera = new Three.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 5;
      this.camera.position.y = 3;
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
      const geometry = new Three.Geometry();
      const material = new Three.LineBasicMaterial({ vertexColors: true });
      const color1 = new Three.Color('red');
      const color2 = new Three.Color('blue');
      const p1 = new Three.Vector3(-10, 0, 0);
      const p2 = new Three.Vector3(10, 0, 0);
      geometry.vertices.push(p1, p2);
      geometry.colors.push(color1, color2);
      const line = new Three.Line(geometry, material, Three.LineSegments);
      // this.scene.add(line);
      const objAll = new Three.Object3D();
      objAll.add(line);
      const ax = new Three.AxesHelper(7);
      objAll.add(ax);
      this.scene.add(objAll);
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
