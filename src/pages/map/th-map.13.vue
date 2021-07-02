<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import axios from 'axios';
import { OutlinePass } from 'three-outlinepass';
import { OrbitControls, RenderPass, EffectComposer } from '../../threeControl';

export default {
  data() {
    return {
      data_object: {},
      data_infos: {},
      data_center: [
        120.02138188499998,
        30.378369387299983,
      ],
    };
  },
  mounted() {
    this.init();
    // this.getData();
  },
  methods: {
    getData() {
      axios.get('/data/hz.json').then((response) => {
        this.data_infos = response.data;
        this.buildInit();
      });
    },
    init() {
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.geometryInit(); // 物体
      this.planeInit();// 平面


      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    cubeDr(a, x, y, z) {
      const cubeGeo = new THREE.BoxGeometry(a, a, a);
      const cubeMat = new THREE.MeshPhongMaterial({
        color: 0xfff000 * Math.random(),
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(x, y, z);
      cube.castShadow = true;
      this.scene.add(cube);
      return cube;
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
      // 设置相机位置在中心点
      // this.camera.position.z =
      this.camera.position.x = 30;
      this.camera.position.y = 30;
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(this.width, this.height);
      // this.renderer.setClearColor('#fff');
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement);
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      // this.control.target.x = this.com_center.x;
      // this.control.target.z = this.com_center.y;
    },
    buildInit() { // 建筑物初始化
      const textureLoader = new THREE.TextureLoader();
      const local_texture = textureLoader.load('./images/casement.png', (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
        });
        this.renderBuild(material);
      });
      local_texture.wrapS = THREE.RepeatWrapping;
      local_texture.wrapT = THREE.RepeatWrapping;
      local_texture.repeat.set(2, 4);
    },
    renderBuild(material) {
      const group = new THREE.Group();
      const geometry = new THREE.BoxBufferGeometry(10, 10, 10);
      const local_arry = [
        120.02138188499998,
        30.378369387299983,
      ];
      for (let i = 0; i < 1; i++) {
        const shape = new THREE.Shape();
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(13360719, 3552279);
        triangleShape.lineTo(13360719, 3552269);
        triangleShape.lineTo(13360746, 3552280);
        triangleShape.lineTo(13360719, 3552279);
        this.data_infos.features[0].geometry.coordinates[0].forEach((item, index) => {
          const local_position = this.getMercator(item);
          console.log(local_position);
          if (index === 0) {
            shape.moveTo(local_position.x, local_position.y);
          } else {
            shape.lineTo(local_position.x, local_position.y);
          }
        });
        console.log(shape);
        const extrudeSettings = {
          depth: 10,
          bevelEnabled: false,
          bevelSegments: 100,
        };
        const local = this.getMercator(local_arry);
        const geometry1 = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00, shadowSide: THREE.DoubleSide });
        const mesh1 = new THREE.Mesh(geometry1, material1);
        const geometry2 = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);
        const mesh2 = new THREE.Mesh(geometry2, material1);
        mesh1.position.x = 0;
        mesh1.position.y = 0;
        mesh1.position.z = 0;
        // group.add(mesh1);
        group.add(mesh2);
        console.log('local', local);
        // mesh2.position.set(local.x, 5, local.y);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(local.x, 5, local.y);
        mesh1.rotateX(Math.PI * 0.5);
        mesh2.rotateX(Math.PI * 0.5);
        group.add(mesh);
      }
      this.scene.add(group);
    },
    planeInit() {
      const grid = new THREE.Points(new THREE.PlaneBufferGeometry(500, 500, 30, 30), new THREE.PointsMaterial({
        color: 'blue',
        size: 1,
      }));
      grid.rotateX(Math.PI * 0.5);
      // 设置位置在中心点
      grid.position.y = 0;
      grid.position.x = this.com_center.x;
      grid.position.z = this.com_center.y;
      const axesHelper = new THREE.AxesHelper(50);
      // 设置位置在中心点
      axesHelper.position.y = 0;
      axesHelper.position.x = this.com_center.x;
      axesHelper.position.z = this.com_center.y;
      this.scene.add(grid);
      this.scene.add(axesHelper);
    },
    geometryInit() { // 物体
      const manager = new THREE.LoadingManager(this.render3D);
      const objLoader = new OBJLoader();
      const _this = this;
      const textureLoader = new THREE.TextureLoader(manager);
      objLoader.load('./images/sgwe.obj', (object) => {
        _this.data_object = object;
        this.data_texture = textureLoader.load('./images/5131_ShuSheng_D_1024.png');
      });
    },
    lightInit() {
      const light1 = new THREE.AmbientLight(0xffffff);
      this.scene.add(light1);
    },
    render3D() {
      const selectedObjects = [];
      this.data_object.traverse((child) => {
        child.children.forEach((item) => {
          if (item.isMesh) {
            item.material.map = this.data_texture;
            selectedObjects.push(item);
          }
        });
      });
      this.compose = new EffectComposer(this.renderer);
      const renderPass = new RenderPass(this.scene, this.camera);

      const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
      outlinePass.renderToScreen = true;

      outlinePass.selectedObjects = selectedObjects;

      this.compose.addPass(renderPass);
      this.compose.addPass(outlinePass);

      const params = {
        edgeStrength: 3.0,
        edgeGlow: 1,
        edgeThickness: 1.0,
        pulsePeriod: 0,
        usePatternTexture: false,
      };
      outlinePass.edgeStrength = params.edgeStrength;
      outlinePass.edgeGlow = params.edgeGlow;
      outlinePass.visibleEdgeColor.set('red');
      outlinePass.hiddenEdgeColor.set('yellow');
      this.cubeDr(4, 0, 6, 0);
      this.scene.add(this.data_object);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.control.update();

      this.renderer.render(this.scene, this.camera);
      if (this.compose) this.compose.render();
    },
    getMercator(positonArry) { // [114.32894, 30.585748]经纬度转墨卡托坐标
      const mercator = {};
      const earthRad = 6378137.0;
      mercator.x = positonArry[0] * Math.PI / 180 * earthRad;
      const local_arry = positonArry[1] * Math.PI / 180;
      mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(local_arry)) / (1.0 - Math.sin(local_arry)));
      return mercator;
    },
    getThreePosition(positonArry) {
      mercator = this.getMercator(positonArry);
      mercator.x -= this.com_center.x;
      mercator.y -= this.com_center.y;
    },
  },
  computed: {
    com_center() {
      return this.getMercator(this.data_center);
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
