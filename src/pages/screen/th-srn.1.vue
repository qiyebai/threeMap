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
      this.planeInit();
      this.lightInit(); // 光源
      this.tentaclesInit(); // 触须
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 300;
      this.camera.position.y = 300;
    },
    lightInit() {
      const light1 = new THREE.AmbientLight(0xffffff);
      this.scene.add(light1);
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 锯齿感
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
    tentaclesInit() { // 触须
      const loca_length = 100;
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      this.data_tentaclesGroup = new THREE.Group();
      for (let i = 0; i < loca_length; i++) {
        const phi = Math.acos(-1 + (2 * i) / loca_length);
        const theta = Math.sqrt(loca_length * Math.PI) * phi;
        const object = new THREE.Object3D();
        object.position.setFromSphericalCoords(100, phi, theta);
        const local_object = object.position.multiplyScalar(2);
        const curve = new THREE.CatmullRomCurve3([
          local_object,
          new THREE.Vector3(0, 0, 0),
        ]);
        const points = curve.getPoints(1);
        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(points);
        const catPoint = [];
        const local_points = [curve.getPoint(0), curve.getPoint(0.4), curve.getPoint(0.8), curve.getPoint(1)];

        local_points.forEach((item) => {
          const { x, y, z } = item;
          catPoint.push(x, y, z);
        });
        geometry.setAttribute('catPosition', new THREE.Float32BufferAttribute(catPoint, 3));
        // geometry.setAttribute('catInitPositon', points);
        const curveObject = new THREE.Line(geometry, material);
        this.data_tentaclesGroup.add(curveObject);
      }
      this.scene.add(this.data_tentaclesGroup);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.control.update();

      for (let i = 0; i < 100; i++) {
        const local_geo = this.data_tentaclesGroup.children[i].geometry;
        debugger;
        // local_geo.attributes.catPosition[1].add(new THREE.Vector3(0, Math.random() * 20 - 10, 0));
        // local_geo.attributes.catPosition[2].add(new THREE.Vector3(0, Math.random() * 20 - 10, 0));
        const local_arry = local_geo.attributes.catPosition.array;
        const l = local_arry.length;
        const local_v = [];
        for (let k = 0; k < l; k += 3) {
          if (k === 4) break;
          local_arry[k] += Math.random() * 4 - 2;
          local_arry[k + 1] += Math.random() * 4 - 2;
          local_arry[k + 2] += Math.random() * 4 - 2;
          local_v.push(new THREE.Vector3(local_arry[k], local_arry[k + 1], local_arry[k + 2]));
        }
        const curve = new THREE.CatmullRomCurve3(local_v);
        const points = curve.getPoints(4);
        const pointsed = [];
        points.forEach((item) => {
          pointsed.push(item.x, item.y, item.z);
        });
        // const pointsed = [-1.864761712609269e-14, -200, 1.587987054680855e-14, -1.6608034002926303e-14, 2638.201170793931, 1.4143009705751363e-14, -1.165476070380793e-14, -125, 9.924919091755345e-15, -5.536011334308767e-15, -59.37500000000003, 4.714336568583788e-15, 1.5777218104420236e-30, -2.842170943040401e-14, 0];
        // const pointsed = [100, 100, 4, 0, 0, 0];
        // local_geo.setAttribute('position', new THREE.Float32BufferAttribute(pointsed, 3));
        // console.log(local_geo.getPointAt());
        local_geo.setAttribute('position', new THREE.Float32BufferAttribute(pointsed, 3));
        local_geo.attributes.position.needsUpdate = true;
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
