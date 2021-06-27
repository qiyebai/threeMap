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
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.geometryInit(); // 物体
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 600;
      this.camera.position.y = 10;
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 锯齿感
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor('#fff');
      container.appendChild(this.renderer.domElement);
      this.control = new TrackballControls(this.camera, this.renderer.domElement);
    },
    geometryInit() { // 物体
      const geometry1 = new THREE.BoxBufferGeometry(10, 10, 10);
      const material2 = new THREE.MeshBasicMaterial({ color: 'red' });
      const mesh = new THREE.Mesh(geometry1, material2);
      this.object = mesh;
      this.scene.add(mesh);
      const LineCurve = new THREE.LineCurve(new THREE.Vector2(-200, 0, 0), new THREE.Vector2(200, 0, 0));
      const material = new THREE.LineBasicMaterial({
        color: 0x000000,
      });
      const geometry = new THREE.Geometry();
      const CurvePath = new THREE.CurvePath();
      // 把多个线条插入到CurvePath中
      CurvePath.curves.push(LineCurve);
      const points = CurvePath.getPoints();
      // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
      geometry.setFromPoints(points);
      const mesh1 = new THREE.Line(geometry, material);
      this.scene.add(mesh1);
      this.line = LineCurve;
      this.trans();
    },
    trans() {
      const testTween = new TWEEN.Tween({ t: 0 }).to({ t: 0.5 }, 2000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(
        (t) => {
          const line = this.line;
          this.object.position.x = this.line.getPoint(t.toFixed(2)).x;
          // console.log(this.line.getPoint(t).x);
          console.log(t);
        },
      )
        // .onComplete(this.trans)
        .start();
      new TWEEN.Tween()
        .to({}, 1000 * 3)
        .onComplete(this.trans)
        .start();
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      TWEEN.update();
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
