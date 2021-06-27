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
      this.camera.position.z = 400;
      this.camera.position.y = 400;
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
      const geometry = new Three.BoxGeometry(100, 100, 100);
      for (let i = 0; i < geometry.faces.length; i += 2) {
        const colors = Math.random() * 0xffffff;
        geometry.faces[i].color.setHex(colors);
        geometry.faces[i + 1].color.setHex(colors);
      }
      const material = new Three.MeshBasicMaterial({ vertexColors: Three.FaceColors });
      const axesHelper = new Three.GridHelper(1000, 10, 0x0000ff, 0x808000);
      this.mesh = new Three.Mesh(geometry, material);
      // object.add(axesHelper);
      this.scene.add(axesHelper);
      this.group = new Three.Group();
      this.group.add(this.mesh);
      this.scene.add(this.group);
      // axesHelper.position.set(0,100,0);
    },
    lightInit() {
      const light = new Three.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1).normalize();
      this.scene.add(light);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.rota += 0.01;
      const v1 = new Three.Vector3(0, 1, 0);
      this.group.rotateOnAxis(v1, 0.1);
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
