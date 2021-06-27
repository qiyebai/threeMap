<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import * as d3 from 'd3-geo';
import { OrbitControls } from '../../threeControl';

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.geometryInit(); // 物体
      // this.planeInit();
      this.renderer.clear();
      document.addEventListener('mousemove', (event) => { // canvas和鼠标的转换公司
        event.preventDefault();
        // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        const rect = event.target.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) - this.width / 2) / (this.width / 2);
        this.mouse.y = (this.height / 2 - (event.clientY - rect.top)) / (this.height / 2);
      }, false);
      this.renderRun(); // 渲染过程
    },
    mouthInit() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      if (this.map) {
        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.map.children, true);
        if (intersects.length > 0) {
          try {
            intersects[0].object.material[0].color.set('red');
          } catch (e) {
            intersects[0].object.material.color.set('red');
          }
        }
      }
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 50;
      // this.camera.position.y = 30;
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
    geometryInit() { // 物体
      const loader = new THREE.FileLoader();

      loader.load('/images/china.json', (data) => {
        const jsonData = JSON.parse(data);
        this.initMap(jsonData); // 解析并绘制地图
      });
    },
    initMap(chinaJson) {
      // 建一个空对象存放对象
      this.map = new THREE.Object3D();

      const _this = this;
      // 墨卡托投影转换
      const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);
      chinaJson.features.forEach((elem) => {
        // 定一个省份3D对象
        const province = new THREE.Object3D();
        // 每个的 坐标 数组
        const coordinates = elem.geometry.coordinates;
        // 循环坐标数组
        coordinates.forEach((multiPolygon) => {
          multiPolygon.forEach((polygon) => {
            const shape = new THREE.Shape();
            const lineMaterial = new THREE.LineBasicMaterial({ color: 'white' });
            const lineGeometry = new THREE.Geometry();

            for (let i = 0; i < polygon.length; i++) {
              const [x, y] = projection(polygon[i]);
              if (i === 0) {
                shape.moveTo(x, -y);
              }
              shape.lineTo(x, -y);
              lineGeometry.vertices.push(new THREE.Vector3(x, -y, 4.01));
            }

            const extrudeSettings = {
              depth: 4,
              bevelEnabled: false,
            };

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({ color: '#02A1E2', transparent: true, opacity: 0.6 });
            const material1 = new THREE.MeshBasicMaterial({ color: '#3480C4', transparent: true, opacity: 0.5 });
            const mesh = new THREE.Mesh(geometry, [material, material1]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            province.add(mesh);
            province.add(line);
          });
        });

        // 将geo的属性放到省份模型中
        province.properties = elem.properties;
        if (elem.properties.contorid) {
          const [x, y] = projection(elem.properties.contorid);
          province.properties._centroid = [x, y];
        }
        // _this.scene.add(province);
        _this.map.add(province);
      });

      this.scene.add(this.map);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.control.update();
      this.mouthInit();
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
