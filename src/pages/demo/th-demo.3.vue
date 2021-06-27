<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';

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
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new Three.Scene();
    },
    cameraInit() { // 相机
      this.camera = new Three.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 300;
      this.camera.position.y = 0;
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
      const geometry = new Three.PlaneGeometry(500, 300);
      const loader = new Three.TextureLoader();
      loader.load('./images/demo.jpeg', (texture) => {
        const material = new Three.MeshBasicMaterial({
          map: texture,
        });
        // 纹理的重复和回环
        texture.repeat.x = 2;
        texture.repeat.y = 5;
        texture.wrapS = Three.repeat;
        texture.wrapT = Three.repeat;
        // 修改纹理的需要清除显卡内存
        texture.needsUpdate = true;
        const mash = new Three.Mesh(geometry, material);
        this.scene.add(mash);
      });
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
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
