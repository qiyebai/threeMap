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
import Stats from 'stats-js';
import { OrbitControls, CSS3DSprite, CSS3DObject, CSS3DRenderer, RenderPass, EffectComposer } from '../../threeControl';

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
      data_beamInfos: {
        type: 'beam',
        data: [
          [
            120.02138188499998,
            30.378369387299983,
          ],
          [
            120.02138188499998,
            30.375369387299983,
          ],
          [
            120.02438188499998,
            30.3790369387299983,
          ],
        ],
      },
      data_glowTexture: false,
      data_flyGroup: false,
      data_flyGeoGroup: false,
      data_flyIndex: 0,
      data_rainDrops: 1000,
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
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom);
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.planeInit();// 平面
      this.lightInit(); // 光源
      this.alarmInit(); // 告警
      this.beamInit();// 光柱
      this.flyInit();// 飞线
      this.rainInit(); // 下雨场景
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
      this.scene2 = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000000);
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
      this.renderer.shadowMapEnabled = true;
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor('#000');
      this.cssRenderer = new CSS3DRenderer();
      this.cssRenderer.setSize(this.width, this.height);
      container.appendChild(this.renderer.domElement);
      container.appendChild(this.cssRenderer.domElement);
      this.cssRenderer.domElement.style.position = 'absolute';
      this.cssRenderer.domElement.style.top = 0;
      this.control = new OrbitControls(this.camera, this.cssRenderer.domElement);
    },
    assignUVs(geometry) {
      const faces = geometry.faces;
      geometry.faceVertexUvs[0] = [];
      for (let i = 0; i < faces.length; i++) {
        if (i % 2 === 0) {
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 2),
          ]);
        } else {
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 2),
            new THREE.Vector2(0, 2),
          ]);
        }
      }
      geometry.uvsNeedUpdate = true;
    },
    buildInit() {
      let i = 1;
      this.data_buildInfos.features.forEach((items) => {
        if (items.geometry?.coordinates) {
          this.buildSet(items.geometry.coordinates[0]);
          i++;
        }
      });
    },
    buildSet(positionArry) {
      const cubeGeometry = new THREE.Geometry();
      const vertices = [];
      const faces = [];
      const buttomShape = new THREE.Shape();
      positionArry.forEach((item, i) => {
        const local_position = this.getThreePosition(item);
        if (i === 0) {
          buttomShape.moveTo(local_position.x, local_position.y);
        } else {
          buttomShape.lineTo(local_position.x, local_position.y);
        }
        vertices.push(new THREE.Vector3(local_position.x, 0, local_position.y));
        vertices.push(new THREE.Vector3(local_position.x, 30, local_position.y));
        if (i === positionArry.length - 1) {
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
      const local_texture = new THREE.TextureLoader().load('./images/building5.jpg');
      const material12 = new THREE.MeshPhongMaterial({
        map: local_texture,
        side: THREE.DoubleSide,
      });
      const mesh1 = new THREE.Mesh(cubeGeometry, material12);
      mesh1.castShadow = true;
      this.scene.add(mesh1);
      local_texture.wrapS = THREE.RepeatWrapping;
      local_texture.wrapT = THREE.RepeatWrapping;
      const material1 = new THREE.MeshBasicMaterial({ color: '#333', side: THREE.DoubleSide });
      const geometry = new THREE.ShapeGeometry(buttomShape);
      const mesh = new THREE.Mesh(geometry, material1);
      mesh.rotateX(Math.PI * 0.5);
      const meshed = mesh.clone();
      this.scene.add(mesh);
      meshed.position.y = 30;
      this.scene.add(meshed);
      local_texture.needsUpdate = true;
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
    beamInit() { // 光柱
      const textureLoader = new THREE.TextureLoader();
      const plane = new THREE.PlaneGeometry(10, 60);
      const material = new THREE.MeshPhongMaterial({
        // 设置矩形网格模型的纹理贴图(光柱特效)
        map: textureLoader.load('./images/beam.png'),
        // 双面显示
        side: THREE.DoubleSide,
        color: '#3BF8AC',
        // 开启透明效果，否则颜色贴图map的透明不起作用
        transparent: true,
      });
      const groupMesh = new THREE.Group();
      const geometry = new THREE.RingGeometry(1, 8, 32);
      const material1 = new THREE.MeshBasicMaterial({
        map: textureLoader.load('./images/beam-circle.png'),
        side: THREE.DoubleSide,
        color: '#3BF8AC',
        transparent: true,
      });
      this.data_beamInfos.data.forEach((item) => {
        const mesh = new THREE.Mesh(plane, material);
        const local_position = this.getThreePosition(item);
        mesh.position.y = 30;
        mesh.position.x = local_position.x;
        mesh.position.z = local_position.y;
        const mesh2 = mesh.clone().rotateY(Math.PI / 2);
        const cricleMesh = new THREE.Mesh(geometry, material1);
        cricleMesh.rotateX(Math.PI / 2);
        cricleMesh.position.x = local_position.x;
        cricleMesh.position.z = local_position.y;
        groupMesh.add(mesh, mesh2, cricleMesh);
      });
      this.scene.add(groupMesh);
    },
    flyInit() { // 飞线
      const fly_group = [];
      const fly_geoGroup = new THREE.Group();
      const local_flyGroup = new THREE.Group();
      const local_center = this.getThreePosition(this.data_beamInfos.data[0]);
      this.data_beamInfos.data.forEach((item, index) => {
        if (index === 0) {
          return false;
        }
        const local_goal = this.getThreePosition(item);
        const local_curve = this.getCubicBezierCurve3(local_center, local_goal);
        const points = local_curve.getPoints(50);
        fly_group.push(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Create the final object to add to the scene
        const curveObject = new THREE.Line(geometry, material);
        local_flyGroup.add(curveObject);
        // 生成物体
        const geometry1 = new THREE.SphereGeometry(4, 4, 4);
        const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry1, material1);
        cube.position.x = local_center.x;
        cube.position.z = local_center.y;
        fly_geoGroup.add(cube);
      });
      this.data_flyGroup = fly_group;
      this.data_flyGeoGroup = fly_geoGroup;
      this.scene.add(this.data_flyGeoGroup);
      this.scene.add(local_flyGroup);
    },
    rainInit() { // 下雨
    // 云朵
      const texture = new THREE.TextureLoader().load('./images/smoke.png');
      const cloudGeo = new THREE.PlaneBufferGeometry(564, 300);
      const cloudMaterial = new THREE.MeshLambertMaterial({ // 图像作为纹理贴图，生成材质
        map: texture,
        side: THREE.DoubleSide,
        color: '#333',
        transparent: true,
      });
      const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.rotateX(Math.PI * 0.5);
      cloud.position.y = 100;
      this.scene.add(cloud);
      // 雨滴
      const textureRain = new THREE.TextureLoader().load('./images/rain.png');
      const materialRain = new THREE.PointsMaterial({ // 用图片初始化顶点材质
        map: textureRain,
        color: '#bbb',
        transparent: true,
      });
      const positions = [];
      this.geom = new THREE.BufferGeometry();
      const rainSpeed = [];

      for (let i = 0; i < this.data_rainDrops; i++) {
        positions.push(Math.random() * 400 - 200);
        positions.push(Math.random() * 350 - 250);
        positions.push(Math.random() * 400 - 200);
        rainSpeed.push(0.5 + Math.random() / 2);
      }
      this.data_rainSpeed = rainSpeed;
      this.geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      this.instance = new THREE.Points(this.geom, materialRain); // 初始化粒子系统
      this.scene.add(this.instance);
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
      const floorMat = new THREE.MeshStandardMaterial({
        roughness: 0.8,
        metalness: 0.2,
        // color: '#000',
        bumpScale: 0.0005,
      });
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('./images/1.png', (map) => {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        floorMat.map = map;
        floorMat.needsUpdate = true;
        const floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
        const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = -Math.PI / 2.0;
        this.scene.add(floorMesh);
      });
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
      const spotLight = new THREE.SpotLight(0xffffff, 2);
      spotLight.position.set(0, 100, 0);

      spotLight.castShadow = true;

      spotLight.shadow.mapSize.width = 1;
      spotLight.shadow.mapSize.height = 1;

      spotLight.shadow.camera.near = 5;
      spotLight.shadow.camera.far = 40;
      spotLight.shadow.camera.fov = 30;
      spotLight.castShadow = true;
      this.scene.add(spotLight);
      // rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
      // this.scene.add(rectLightHelper);
      // const pointLight = new THREE.PointLight('#fff', 2, 0);
      // pointLight.position.set(0, 80, 0);
      // this.scene.add(pointLight);
      // const sphereSize = 1;
      // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
      // this.scene.add(pointLightHelper);
      // const dirLight = new THREE.DirectionalLight(0xffffff, 10);
      // dirLight.color.setHSL(0.1, 1, 0.95);
      // dirLight.position.set(-1, 1.75, 1);
      // dirLight.position.multiplyScalar(30);
      // this.scene.add(dirLight);
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
      this.effect(selectedObjects);
      this.data_object.scale.x = 10;
      this.data_object.scale.y = 10;
      this.data_object.scale.z = 10;
      this.scene.add(this.data_object);
    },
    effect(selectedObjects) {
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
      // outlinePass.visibleEdgeColor.set('red');
      outlinePass.hiddenEdgeColor.set('yellow');
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.stats.begin();
      this.stats.end();
      this.control.update();
      // 飞线
      if (this.data_glowTexture) {
        this.data_glowTexture.offset.x -= 0.06;
      }
      /// 物体移动
      if (this.data_flyGeoGroup) {
        this.data_flyGeoGroup.children.forEach((item, index) => {
          const { x, y, z } = this.data_flyGroup[index][this.data_flyIndex];
          item.position.x = x;
          item.position.y = y;
          item.position.z = z;
        });
      }
      this.data_flyIndex++;
      if (this.data_flyIndex > 50) {
        this.data_flyIndex = 0;
      }
      // 雨滴动画
      const positions = this.geom.attributes.position.array;
      for (let i = 0; i < this.data_rainDrops * 3; i += 3) { // 改变Y坐标，加速运动
        this.data_rainSpeed[i / 3] += Math.random() * 0.05;
        positions[i + 1] -= this.data_rainSpeed[i / 3];
        if (positions[i + 1] < -20) {
          positions[i + 1] = 80;
          this.data_rainSpeed[i / 3] = 0.5 + Math.random() / 2;
        }
      }
      this.geom.attributes.position.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);
      this.cssRenderer.render(this.scene2, this.camera);
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
      const local_position = this.getMercator(positonArry);
      local_position.x -= this.com_center.x;
      local_position.y -= this.com_center.y;
      return local_position;
    },
    getCubicBezierCurve3(startPosition, endPosition) { // 获取到生成的贝塞尔曲线
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(startPosition.x, 0, startPosition.y),
        new THREE.Vector3((endPosition.x - startPosition.x) / 3 + startPosition.x, 100, (endPosition.y - startPosition.y) / 3 + startPosition.y),
        new THREE.Vector3((endPosition.x - startPosition.x) / 3 * 2 + startPosition.x, 100, (endPosition.y - startPosition.y) / 3 * 2 + startPosition.y),
        new THREE.Vector3(endPosition.x, 0, endPosition.y),
      );
      return curve;
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
