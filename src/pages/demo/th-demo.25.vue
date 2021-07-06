<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import Stats from 'stats-js';
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
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom);
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.planeInit();
      this.lightInit(); // 光源
      this.geometryInit();
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = -90;
      this.camera.position.y = 90;
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
    assignUVs(geometry) {
      const faces = geometry.faces;
      geometry.faceVertexUvs[0] = [];
      for (let i = 0; i < faces.length; i++) {
        if (i % 2 === 0) {
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1),
          ]);
        } else {
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1),
          ]);
        }
      }
      geometry.uvsNeedUpdate = true;
    },
    geometryInit() {
      const cubeGeometry = new THREE.Geometry();
      const local_position = [[-30, 0, 30], [30, 0, 30], [30, 0, -30], [0, 0, -60], [-30, 0, -30]];
      const vertices = [];
      const faces = [];
      const buttomShape = new THREE.Shape();
      local_position.forEach((item, i) => {
        if (i === 0) {
          buttomShape.moveTo(item[0], item[2]);
        } else {
          buttomShape.lineTo(item[0], item[2]);
        }
        vertices.push(new THREE.Vector3(item[0], item[1], item[2]));
        vertices.push(new THREE.Vector3(item[0], item[1] + 30, item[2]));
        if (i === local_position.length - 1) {
          faces.push(new THREE.Face3(2 * i, 0, 1));
          faces.push(new THREE.Face3(2 * i, 1, 2 * i + 1));
        } else {
          faces.push(new THREE.Face3(2 * i, 2 * i + 2, 2 * i + 3));
          faces.push(new THREE.Face3(2 * i, 2 * i + 3, 2 * i + 1));
        }
      });
      cubeGeometry.vertices = vertices;
      cubeGeometry.faces = faces;
      // 生成法向量
      this.assignUVs(cubeGeometry);
      cubeGeometry.computeFaceNormals();
      const textureLoader = new THREE.TextureLoader();
      const local_texture = textureLoader.load('./images/building5.jpg', (texture) => {
        const material1 = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(cubeGeometry, material1);
        this.scene.add(mesh);
      });
      const material1 = new THREE.MeshBasicMaterial({ color: '#666', side: THREE.DoubleSide });
      const geometry = new THREE.ShapeGeometry(buttomShape);
      const mesh = new THREE.Mesh(geometry, material1);
      mesh.rotateX(Math.PI * 0.5);
      const meshed = mesh.clone();
      this.scene.add(mesh);
      meshed.position.y = 30;
      this.scene.add(meshed);
      local_texture.needsUpdate = true;
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
    lightInit() {
      const light1 = new THREE.AmbientLight(0xffffff);
      this.scene.add(light1);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.stats.begin();
      this.stats.end();
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
