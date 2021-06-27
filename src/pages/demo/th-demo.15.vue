<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

export default {
  data() {
    return {
      pointMesh: [],
      runStatus: {
        direction: 'down',
        upCount: 0,
        downCount: 0,
      },
      time: 0,
      isDriection: 'down',
    };
  },
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
      setInterval(() => {
        this.isDriection = this.isDriection === 'up' ? 'down' : 'up';
      }, 5000);
    },
    sceneInit() { // 场景
      this.scene = new Three.Scene();
    },
    cameraInit() { // 相机
      this.camera = new Three.PerspectiveCamera(75, 2 / 1, 0.1, 10000);
      this.camera.position.z = 300;
      this.camera.position.y = 300;
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
      this.parent = new Three.Object3D();
      const grid = new Three.Points(new Three.PlaneBufferGeometry(1500, 1500, 64, 64), new Three.PointsMaterial({
        color: 'blue',
        size: 1,
      }));
      this.parent.add(grid);
      this.parent.rotateX(Math.PI * 0.5);
      this.parent.position.y = 0;
      this.scene.add(this.parent);
      const manager = new Three.LoadingManager();
      const objLoader = new OBJLoader(manager);
      objLoader.load('./images/male02.obj', (object) => {
        const material = new Three.PointsMaterial({
          color: 'blue',
          size: 2,
        });
        this.pointMesh = [];
        let indexs = 0;
        let cube;
        object.traverse((child) => {
          if (child.isMesh) {
            if (indexs === 0) {
              cube = child.geometry;
            } else {
              cube = BufferGeometryUtils.mergeBufferGeometries([cube, child.geometry], true);// 合并同类的geometry
            }
            indexs++;
          }
        });
        const mepoint = new Three.Points(cube, material);
        console.log(mepoint);
        this.scene.add(mepoint);
        this.pointMesh.push({
          mesh: mepoint,
        });
      });
    },
    pointRun() {
      const speed = 10;
      for (let j = 0; j < this.pointMesh.length; j++) {
        const positions = this.pointMesh[j].mesh.geometry.attributes.position;
        const count = positions.count;
        for (let i = 0; i < count; i++) {
          const px = positions.getX(i);
          const py = positions.getY(i);
          const pz = positions.getZ(i);
          if (py > 0) {
            positions.setXYZ(
              i,
              px + 0.3 * (0.50 - Math.random() * speed),
              py + 3.0 * (0.25 - Math.random() * speed),
              pz + 0.2 * (0.50 - Math.random() * speed),
            );
          }
        }
        positions.needsUpdate = true;
      }
    },
    combineBuffer(model, bufferName) {

    },
    createMesh(positions, scene, scale, x, y, z, color) {


    },
    lightInit() {
      const light = new Three.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1).normalize();
      this.scene.add(light);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      if (this.pointMesh) {
        this.pointRun();
      }
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
