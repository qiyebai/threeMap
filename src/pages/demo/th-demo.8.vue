<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

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
      this.lightInit(); // 光源
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new Three.Scene();
    },
    cameraInit() { // 相机
      this.camera = new Three.PerspectiveCamera(75, 2 / 1, 0.1, 10000);
      this.camera.position.z = 200;
      this.camera.lookAt(0, 0, 0);
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
      const manager = new Three.LoadingManager();
      const texture = new Three.Texture();
      const loader = new Three.ImageLoader(manager);
      loader.load('./images/UV_Grid_Sm.jpg', (img) => {
        texture.image = img;
        texture.needsUpdate = true;
      });
      const objLoader = new OBJLoader(manager);
      objLoader.load('./images/male02.obj', (object) => {
        object.traverse((child) => {
          if (child instanceof Three.Mesh) {
            child.material.map = texture;
          }
        });
        object.position.y = -80;
        const axesHelper = new Three.AxesHelper(100);
        // axesHelper.position.set(0,100,0);
        this.scene.add(axesHelper);
        this.scene.add(object);
      });
    },
    lightInit() {
      const light = new Three.DirectionalLight('#fff');
      light.position.set(200, 200, 1000).normalize();
      this.scene.add(light);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.scene.rotateY(0.02 * Math.PI);
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
