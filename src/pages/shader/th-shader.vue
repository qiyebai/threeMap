<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from '../../threeControl';

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
      this.planeInit();
      this.lightInit(); // 光源
      this.tentaclesInit();
      this.renderer.clear();
      this.renderRun(); // 渲染过程
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 300;
      this.camera.position.y = 300;
    },
    lightInit() {
      const light1 = new THREE.AmbientLight(0xffffff);
      this.scene.add(light1);
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
    tentaclesInit() {
      const geometry = new THREE.PlaneBufferGeometry(2, 2);

      const uniforms = {
        u_time: { type: 'f', value: 1.0 },
        u_resolution: { type: 'v2', value: new THREE.Vector2() },
      };
      const vertexShader = `
        void main() {
          gl_Position = vec4( position, 1.0 );
        }
        `;
      const fragmentShader = `
        uniform vec2 u_resolution;
        uniform float u_time;
        void main() {
          vec2 st = gl_FragCoord.xy/u_resolution.xy;
          gl_FragColor=vec4(st.x,st.y,0.0,1.0);
        }
      `;
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      // this.control.update();
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
