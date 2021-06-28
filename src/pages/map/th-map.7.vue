<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import axios from 'axios';
import { OrbitControls, CSS3DSprite, CSS3DObject, CSS3DRenderer } from '../../threeControl';

export default {
  data() {
    return {
      data_object: {},
      data_buildInfos: {},
      data_roadInfos: {},
      data_center: [
        120.02138188499998,
        30.378369387299983,
      ],
      data_glowTexture: false,
    };
  },
  mounted() {
    this.init();
    this.getData();
  },
  methods: {
    getData() {
      axios.get('/data/build.json').then((res) => {
        this.data_buildInfos = res.data;
        this.buildInit();
      });
      axios.get('/data/road.json').then((res) => {
        this.data_roadInfos = res.data;
        this.roadInit();
      });
    },
    init() {
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.planeInit();// 平面
      this.lightInit(); // 光源
      this.alarmInit(); // 告警
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
      this.scene2 = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000000000);
      // 设置相机位置在中心点
      this.camera.position.z = 100;
      this.camera.position.y = 100;
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
      this.cssRenderer = new CSS3DRenderer();
      this.cssRenderer.setSize(this.width, this.height);
      container.appendChild(this.renderer.domElement);
      container.appendChild(this.cssRenderer.domElement);
      this.cssRenderer.domElement.style.position = 'absolute';
      this.cssRenderer.domElement.style.top = 0;
      this.control = new OrbitControls(this.camera, this.cssRenderer.domElement);
    },
    buildInit() { // 建筑物初始化
      const textureLoader = new THREE.TextureLoader();
      const local_texture = textureLoader.load('./images/building5.jpg', (texture) => {
        this.renderBuild(texture);
      });
      local_texture.wrapS = THREE.RepeatWrapping;
      local_texture.wrapT = THREE.RepeatWrapping;
      local_texture.repeat.set(1, 0.1);
      local_texture.offset.set(0.01, 1);
    },
    renderBuild(texture) {
      const group = new THREE.Group();
      const material1 = new THREE.MeshBasicMaterial({ color: 0x999aaa, shadowSide: THREE.DoubleSide });
      this.data_buildInfos.features.forEach((items) => {
        const shape = new THREE.Shape();
        items.geometry.coordinates[0].forEach((item, index) => {
          const local_position = this.getThreePosition(item);
          if (index === 0) {
            shape.moveTo(local_position.x, local_position.y);
          } else {
            shape.lineTo(local_position.x, local_position.y);
          }
        });
        const depth = 2 * items.properties.Floor;
        const extrudeSettings = { depth, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
        const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({
          map: texture,
        });
        const mesh = new THREE.Mesh(geometry, [material1, material]);
        mesh.position.y = depth;
        mesh.rotateX(Math.PI * 0.5);
        group.add(mesh);
      });
      this.scene.add(group);
    },
    roadInit() {
      this.setGlow(); // 道路辉光
    },
    setGlow() { // 道路辉光
      this.data_glowTexture = new THREE.TextureLoader().load('./images/glow.png');
      this.data_glowTexture.wrapS = THREE.RepeatWrapping;
      this.data_glowTexture.wrapT = THREE.RepeatWrapping;
      this.data_glowTexture.repeat.set(1, 1);
      this.data_glowTexture.needsUpdate = true;
      const material = new THREE.MeshBasicMaterial({
        map: this.data_glowTexture,
        side: THREE.BackSide,
        transparent: true,
      });
      // // 创建顶点数组
      this.data_roadGroup = new THREE.Group();
      this.data_roadInfos.data.forEach((items) => {
        const points = [];
        items.geometry.forEach((item) => {
          // 创建顶点数组
          const local_position = this.getThreePosition(item);
          points.push(new THREE.Vector3(local_position.x, 0, local_position.y));
        });
        // CatmullRomCurve3创建一条平滑的三维样条曲线
        const curve = new THREE.CatmullRomCurve3(points); // 曲线路径
        // 创建管道
        const tubeGeometry = new THREE.TubeGeometry(curve, 80, 1);
        const mesh = new THREE.Mesh(tubeGeometry, material);
        this.data_roadGroup.add(mesh);
      });
      this.scene.add(this.data_roadGroup);
    },
    alarmInit() { // 告警
      const element = document.createElement('div');
      element.className = 'element';
      element.textContent = '告警';
      const object = new CSS3DSprite(element);
      object.scale.x = 0.3;
      object.scale.y = 0.3;
      // const object = new CSS3DSprite(element);
      object.position.x = 0;
      object.position.y = 20;
      object.position.z = 0;
      this.scene2.add(object);
    },
    planeInit() {
      const grid = new THREE.Points(new THREE.PlaneBufferGeometry(500, 500, 30, 30), new THREE.PointsMaterial({
        color: 'blue',
        size: 1,
      }));
      grid.rotateX(Math.PI * 0.5);
      // 设置位置在中心点
      const axesHelper = new THREE.AxesHelper(50);
      // 设置位置在中心点
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
      this.data_object.traverse((child) => {
        child.children.forEach((item) => {
          if (item.isMesh) item.material.map = this.data_texture;
        });
      });
      this.scene.add(this.data_object);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.control.update();
      if (this.data_glowTexture) {
        this.data_glowTexture.offset.x -= 0.06;
      }
      this.renderer.render(this.scene, this.camera);
      this.cssRenderer.render(this.scene2, this.camera);
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
      const local_position = this.getMercator(positonArry);
      local_position.x -= this.com_center.x;
      local_position.y -= this.com_center.y;
      return local_position;
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
  position: relative;
}

</style>
<style>
.element{
  height: 20px;
  width: 30px;
  font-size: 12px;
  text-align: center;
  background: red;
  transform: scale(0.3)
}
</style>
