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
      this.geometryInit(); // 物体
      this.lightInit();
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    lightInit() {
      const light = new THREE.PointLight('#fff', 1, 400, 1);
      light.position.set(0, 100, 200);
      light.castShadow = true;
      this.scene.add(light);
      const light1 = new THREE.AmbientLight('#6d8087'); // soft white light
      this.scene.add(light1);
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 200;
      this.camera.position.y = 20;
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 锯齿感
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor('#999');
      container.appendChild(this.renderer.domElement);
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      this.renderer.shadowMapEnabled = true;
    },
    geometryInit() { // 物体
      const grid = new THREE.Points(new THREE.PlaneBufferGeometry(500, 500, 30, 30), new THREE.PointsMaterial({
        color: 'blue',
        size: 1,
      }));
      grid.rotateX(Math.PI * 0.5);
      grid.position.y = 0;
      const axesHelper = new THREE.AxesHelper(50);
      this.scene.add(grid);
      // grid.receiveShadow = true;
      this.scene.add(axesHelper);
      this.paintingRobot();
    },
    paintEllipse(material, header, food, height) {
      const groud = new THREE.Group();
      const geometry = new THREE.SphereGeometry(header, 32, 32, 0, Math.PI);
      const sphere = new THREE.Mesh(geometry, material);
      sphere.rotateX(-Math.PI * 0.5);
      sphere.position.y = height / 2;
      groud.add(sphere);

      const geometry6 = new THREE.CylinderBufferGeometry(header, food, height, 32, 2, false);
      const cylinder2 = new THREE.Mesh(geometry6, material);
      groud.add(cylinder2);
      const geometry7 = new THREE.SphereGeometry(food, 32, 32, 0, Math.PI);
      const sphere9 = new THREE.Mesh(geometry7, material);
      sphere9.rotateX(Math.PI * 0.5);
      sphere9.position.y = -height / 2;
      groud.add(sphere9);
      return groud;
    },
    paintEllipseBody(material, header, food, height) {
      const groud = new THREE.Group();
      const geometry = new THREE.ConeBufferGeometry(header, 6, 32, 32, true);
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.y = 17;
      sphere.rotateZ(Math.PI);
      groud.add(sphere);

      const geometry6 = new THREE.CylinderBufferGeometry(header, food, height, 32, 2, true);
      const cylinder2 = new THREE.Mesh(geometry6, material);
      groud.add(cylinder2);
      const geometry7 = new THREE.SphereGeometry(food, 32, 32, 0, Math.PI);
      const sphere9 = new THREE.Mesh(geometry7, material);
      sphere9.rotateX(Math.PI * 0.5);
      sphere9.position.y = -height / 2;
      groud.add(sphere9);
      return groud;
    },
    paintingRobot() {
      // 身子
      const material1 = new THREE.MeshLambertMaterial({ color: '#fff', side: THREE.DoubleSide });
      const material = new THREE.MeshLambertMaterial({ color: '#2d8cf0', side: THREE.DoubleSide, emissiveIntensity: 100 });
      const body = this.paintEllipseBody(material1, 20, 10, 40);
      this.scene.add(body);

      // 手
      const leftHand = this.paintEllipse(material, 4, 2, 20);
      leftHand.position.x = -28;
      leftHand.position.y = 4;
      leftHand.rotateZ(-Math.PI * 0.04);
      this.scene.add(leftHand);

      const rightHand = this.paintEllipse(material, 4, 2, 20);
      rightHand.position.x = 28;
      rightHand.position.y = 4;
      rightHand.rotateZ(Math.PI * 0.04);
      this.scene.add(rightHand);
      // 头
      const head = new THREE.Group();
      const geometry3 = new THREE.SphereBufferGeometry(22, 32, 32);
      const sphere3 = new THREE.Mesh(geometry3, material);
      sphere3.position.y = 52;
      head.add(sphere3);

      // 眼睛
      const material2 = new THREE.MeshBasicMaterial({ color: '#bbe6ed', side: THREE.DoubleSide });
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0, 0);
      heartShape.lineTo(10, 0);
      heartShape.lineTo(12, 4);
      heartShape.lineTo(14, 0);
      heartShape.lineTo(24, 0);
      heartShape.lineTo(28, 11);
      heartShape.lineTo(-4, 11);
      const geometry = new THREE.ShapeBufferGeometry(heartShape);
      const mesh = new THREE.Mesh(geometry, material2);
      mesh.position.z = 22;
      mesh.position.y = 46;
      mesh.position.x = -11;
      head.add(mesh);
      // 触角
      const rightAntenna = this.paintEllipse(material, 2, 2, 20);
      rightAntenna.position.y = 70;
      rightAntenna.position.x = -20;
      rightAntenna.rotateZ(Math.PI * 0.25);
      head.add(rightAntenna);
      const leftAntenna = this.paintEllipse(material, 2, 2, 20);
      leftAntenna.position.y = 70;
      leftAntenna.position.x = 20;
      leftAntenna.rotateZ(-Math.PI * 0.25);
      head.add(leftAntenna);
      head.position.y = -8;
      // head.scale.set(0.5, 0.5, 0.5);
      this.scene.add(head);
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
