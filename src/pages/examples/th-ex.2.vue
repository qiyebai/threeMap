<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import * as TWEEN from 'tween';
import { TrackballControls, CSS3DRenderer, CSS3DSprite } from '../../threeControl';

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.height = 600;
      this.width = 1200;
      this.particlesTotal = 512;
      this.positions = {
        plane: [],
        cube: [],
        random: [],
        Sphere: [],
      };
      this.objects = [];
      this.positionInit();
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.geometryInit(); // 物体
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    positionInit() {
      const amountX = 16;
      const amountZ = 32;
      const separation = 150;
      const offsetX = ((amountX - 1) * separation) / 2;
      const offsetZ = ((amountZ - 1) * separation) / 2;

      for (let i = 0; i < this.particlesTotal; i++) {
        const x = (i % amountX) * separation;
        const z = Math.floor(i / amountX) * separation;
        const y = (Math.sin(x * 0.5) + Math.sin(z * 0.5)) * 200;
        this.positions.plane.push([x - offsetX, y, z - offsetZ]);
      }
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 10000);
      this.camera.position.z = 3000;
      this.camera.position.y = 0;
    },
    renderInit() { // 渲染器
      this.renderer = new CSS3DRenderer();
      this.renderer.setSize(this.width, this.height);
      document.getElementById('container').appendChild(this.renderer.domElement);
      this.control = new TrackballControls(this.camera, this.renderer.domElement);
    },
    geometryInit() { // 物体
      const image = document.createElement('img');
      image.src = 'textures/sprite.png';
      image.addEventListener('load', () => {
        for (let i = 0; i < this.particlesTotal; i++) {
          const object = new CSS3DSprite(image.cloneNode());
          object.position.x = Math.random() * 4000 - 2000;
          object.position.y = Math.random() * 4000 - 2000;
          object.position.z = Math.random() * 4000 - 2000;
          this.scene.add(object);
          this.objects.push(object);
        }
        this.transition();
      },
      );
    },
    transition() {
      const duration = 2000;
      for (let i = 0; i < this.particlesTotal; i++) {
        const object = this.objects[i];
        new TWEEN.Tween(object.position)
          .to({
            x: this.positions.plane[i][0],
            y: this.positions.plane[i][1],
            z: this.positions.plane[i][2],
          }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }
      new TWEEN.Tween(this)
        .to({}, duration * 3)
        .onComplete(this.transition)
        .start();
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.renderer.render(this.scene, this.camera);
      this.control.update();
      TWEEN.update();
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
