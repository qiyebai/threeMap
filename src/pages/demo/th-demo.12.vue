<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

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
      this.camera.position.z = 0;
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
      const GridHelper = new Three.GridHelper(1000, 10, 'red', 'blue');
      this.scene.add(GridHelper);
      const geometry = new Three.BoxGeometry(50, 50, 50);
      for (let i = 0; i < geometry.faces.length; i += 2) {
        const colors = Math.random() * 0xffffff;
        geometry.faces[i].color.setHex(colors);
        geometry.faces[i + 1].color.setHex(colors);
      }
      const material = new Three.MeshBasicMaterial({ vertexColors: Three.FaceColors });
      this.mesh = new Three.Mesh(geometry, material);
      // object.add(axesHelper);
      this.mesh.position.x = -100;
      this.mesh.position.z = 100;
      this.meshGroup = new Three.Group();
      this.meshGroup.add(this.mesh);
      // this.meshGroup.position.x = -100;
      // this.meshGroup.position.z = 100;
      // this.scene.add(this.meshGroup);


      const group = new Three.Group();
      group.add(this.meshGroup);

      const box3 = new Three.BoxHelper(group); // 一个mesh的包围盒子
      const box1 = new Three.Box3().setFromObject(this.meshGroup);
      box1.center(this.meshGroup.position);
      group.position.multiplyScalar(-1);
      box1.center(group.position);

      const boxhelper = new Three.AxesHelper(100);
      boxhelper.position.copy(group.position);
      this.scene.add(box3);
      this.scene.add(group);
      this.scene.add(boxhelper);
      this.group = group;
      const geometry2 = new Three.BoxGeometry(50, 50, 50);
      for (let i = 0; i < geometry2.faces.length; i += 2) {
        const colors = Math.random() * 0xffffff;
        geometry2.faces[i].color.setHex(colors);
        geometry2.faces[i + 1].color.setHex(colors);
      }
      const axesHelper2 = new Three.AxesHelper(100);
      this.mesh2 = new Three.Mesh(geometry2, material);
      // object.add(axesHelper);
      this.mesh2.position.x = 140;
      this.mesh2.position.z = 140;
      axesHelper2.position.copy(this.mesh2.position);
      this.scene.add(axesHelper2);
      this.scene.add(this.mesh2);
      const box = new Three.BoxHelper(this.mesh2); // 一个mesh的包围盒子
      this.scene.add(box);
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
