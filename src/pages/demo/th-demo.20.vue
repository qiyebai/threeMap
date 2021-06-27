<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
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
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.geometryInit(); // 物体
      this.planeInit();
      this.obstacle();// 障碍物
      this.lightInit(); // 光源
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
      this.camera.lookAt({
        x: 100,
        y: 100,
        z: 0,
      });
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
    obstacle() {
      const textureLoader = new THREE.TextureLoader();
      const local_texture = textureLoader.load('./images/building.jpg', (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
        });
        this.renderObstacle(material);
      });
      local_texture.wrapS = THREE.RepeatWrapping;
      local_texture.wrapT = THREE.RepeatWrapping;
      local_texture.repeat.set(10, 10);
    },
    renderObstacle(material) {
      const group = new THREE.Group();
      const geometry = new THREE.BoxBufferGeometry(2, 10, 2);
      for (let i = 0; i < 60; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(parseInt(Math.random() * 40) - 20, 5, parseInt(Math.random() * 100));
        group.add(mesh);
      }
      this.scene.add(group);
    },
    controls() {
      window.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
          case 38: /* up */
          case 87: /* W */ this.move('up', this.data_object.position); break;
          case 37: /* left */
          case 65: /* A */ this.move('left', this.data_object.position); break;

          case 40: /* down */
          case 83: /* S */ this.move('down', this.data_object.position); break;

          case 39: /* right */
          case 68: /* D */ this.move('right', this.data_object.position); break;
          default: break;
        }
        // this.data_object.position.x -= 1;
      }, false);
    },
    move(direction, value_object) {
      switch (direction) {
        case 'up': value_object.z += 1; break;
        case 'down': value_object.z -= 1; break;
        case 'left': value_object.x += 1; break;
        case 'right': value_object.x -= 1; break;
        default: break;
      }
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
      this.controls();
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
