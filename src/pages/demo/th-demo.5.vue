<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';
import { VertexColors } from 'three';

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
      this.camera.position.z = 400;
      this.camera.position.y = 0;
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
      const meterial = new Three.MeshBasicMaterial({ vertexColors: Three.VertexColors, wireframe: false, color: 'red' });
      const color1 = new Three.Color('red');
      const color2 = new Three.Color('blue');
      const color3 = new Three.Color('yellow');
      const p1 = new Three.Vector3(100, 0, 0);
      const p2 = new Three.Vector3(0, -100, 0);
      const p3 = new Three.Vector3(-100, 0, 0);
      geometry.vertices.push(p1);
      geometry.vertices.push(p2);
      geometry.vertices.push(p3);
      const face = new Three.Face3(0, 2, 1);
      face.vertexColors[0] = color1;
      face.vertexColors[1] = color2;
      face.vertexColors[2] = color3;
      geometry.faces.push(face);
      console.log(face);
      console.log(geometry);
      // geometry.vertices.push(
      //   new Three.Vector3(100, 0, 0),
      //   new Three.Vector3(0, -40, 0),
      //   new Three.Vector3(-100, 0, 0),
      // );

      // geometry.faces.push(new Three.Face3(0, 2, 1));
      const object = new Three.Mesh(geometry, meterial);
      this.scene.add(object);
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
