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
      document.addEventListener('mousemove', (event) => { // canvas和鼠标的转换公司
        event.preventDefault();
        // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        const rect = event.target.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) - this.width / 2) / (this.width / 2);
        this.mouse.y = (this.height / 2 - (event.clientY - rect.top)) / (this.height / 2);
      }, false);
    },
    mouthInit() {
      this.raycaster.setFromCamera(this.mouse, this.camera); // 坐标归一化
      const intersects = this.raycaster.intersectObjects(this.scene.children);
      if (intersects.length > 0) {
        // eslint-disable-next-line eqeqeq
        if (this.INTERSECTED !== intersects[0].object) {
          if (this.INTERSECTED) {
            this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
          }
          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
          this.INTERSECTED.material.emissive.setHex(0xff0000);
        }
      } else {
        if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);

        this.INTERSECTED = null;
      }
    },
    sceneInit() { // 场景
      this.scene = new Three.Scene();
    },
    cameraInit() { // 相机
      this.camera = new Three.PerspectiveCamera(75, 2 / 1, 0.1, 1000);
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
      const geometry = new Three.BoxBufferGeometry(20, 20, 20);
      for (let i = 0; i < 200; i++) {
        const object = new Three.Mesh(geometry, new Three.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
        object.position.x = Math.random() * 800 - 400;
        object.position.y = Math.random() * 800 - 400;
        object.position.z = Math.random() * 800 - 400;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;
        this.scene.add(object);
      }
      // const axesHelper = new Three.AxesHelper(100);
      // // axesHelper.position.set(0,100,0);
      // this.scene.add(axesHelper);
    },
    lightInit() {
      const light = new Three.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1).normalize();
      this.scene.add(light);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      this.rota += 0.1;
      this.camera.position.x = this.radius * Math.sin(Three.Math.degToRad(this.rota));
      this.camera.position.y = this.radius * Math.sin(Three.Math.degToRad(this.rota));
      this.camera.position.z = this.radius * Math.cos(Three.Math.degToRad(this.rota));
      this.camera.lookAt(this.scene.position);
      this.camera.updateMatrixWorld();
      // this.scene.rotateY(0.02 * Math.PI);
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
