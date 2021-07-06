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
      this.camera.position.z = -30;
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
    assignUVs(geometry) {
      geometry.computeBoundingBox();
      const max = geometry.boundingBox.max;
      const min = geometry.boundingBox.min;
      const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
      const range = new THREE.Vector2(max.x - min.x, max.y - min.y);
      const faces = geometry.faces;
      geometry.faceVertexUvs[0] = [];
      for (let i = 0; i < faces.length; i++) {
        const v1 = geometry.vertices[faces[i].a];
        const v2 = geometry.vertices[faces[i].b];
        const v3 = geometry.vertices[faces[i].c];
        // geometry.faceVertexUvs[0].push([
        //   new THREE.Vector2((v1.x + offset.x) / range.x, 0.5),
        //   new THREE.Vector2((v2.x + offset.x) / range.x, 1),
        //   new THREE.Vector2((v3.x + offset.x) / range.x, 0.5),
        // ]);
        if (i === 0) {
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
      const vertices = [
        {
          x: -30,
          y: 0,
          z: 30,
        },
        {
          x: -30,
          y: 30,
          z: 30,
        },
        {
          x: 30,
          y: 0,
          z: 30,
        },
        {
          x: 30,
          y: 30,
          z: 30,
        },
        {
          x: 30,
          y: 0,
          z: -30,
        },
        {
          x: 30,
          y: 30,
          z: -30,
        },
      ];
      cubeGeometry.vertices = vertices;
      // 创建立方的面
      const faces = [
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(0, 3, 1),
        new THREE.Face3(2, 4, 5),
        new THREE.Face3(2, 5, 3),
        // new THREE.Face3(4, 6, 7),
        // new THREE.Face3(4, 7, 5),
      ];
      cubeGeometry.faces = faces;
      // 生成法向量
      cubeGeometry.computeFaceNormals();
      this.assignUVs(cubeGeometry);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
      const textureLoader = new THREE.TextureLoader();
      const local_texture = textureLoader.load('./images/casement.png', (texture) => {
        const material1 = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        console.log(cubeGeometry);
        const mesh = new THREE.Mesh(cubeGeometry, material1);
        this.scene.add(mesh);
      });
      local_texture.needsUpdate = true;
      local_texture.wrapS = THREE.RepeatWrapping;
      local_texture.wrapT = THREE.RepeatWrapping;
      local_texture.repeat.set(3, 3);


      // const geometry = new THREE.BufferGeometry();
      // // 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
      // // 因为在两个三角面片里，这两个顶点都需要被用到。
      // const vertices = new Float32Array([
      //   -10.0, -10.0, 10.0,
      //   10.0, -10.0, 10.0,
      //   10.0, 10.0, 10.0,

      //   10.0, 10.0, 10.0,
      //   -10.0, 10.0, 10.0,
      //   -10.0, -10.0, 10.0,
      // ]);

      // // itemSize = 3 因为每个顶点都是一个三元组。
      // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      // const material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
      // const mesh = new THREE.Mesh(geometry, material);
      // this.scene.add(mesh);
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
