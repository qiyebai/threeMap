<template>
  <div class="content">
    <div class="three" id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { OrbitControls } from '../../threeControl';

export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      animateDots: [],
      index: 0,
    };
  },
  methods: {
    init() {
      this.height = 600;
      this.width = 1200;
      this.sceneInit();// 场景
      this.cameraInit();// 相机
      this.renderInit();// 渲染器
      this.geometryInit(); // 物体
      this.lightInit();
      this.renderer.clear();
      this.renderRun(); // 渲染过程
      this.shader();
    },
    shader() {
      this.vertexShader = `
      uniform float time;
      uniform vec3 begin;
      varying vec3 posChanged;
      void main(){
          posChanged = position;
          float d = distance(vec3(posChanged.x,posChanged.y,0), begin);
          float pointsize = 0.0;
          if(d > time && d < time +2000.0){
            pointsize = (d - time)/2000.0*4.0;
          }
          gl_PointSize = pointsize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(posChanged,1.0);
      }`;
      this.shaderMaterials = `
        uniform float time;
        uniform vec3 begin;
        varying vec3 posChanged;
        void main( void ) {
        float d = distance(vec3(posChanged.x,posChanged.y,0), begin);
        float opacity = 0.0;
        float col = 0.0;
        if(d > time && d <time +2000.0){
          opacity = 1.0;
          col = 1.0-fract((d - time)/2000.0);
        } else {
        discard;
        }
        gl_FragColor = vec4(0.7,col,col,col);
    }`;
    },
    lightInit() {
      // const dirLight = new THREE.DirectionalLight(0xffffff);
      // dirLight.position.set(0, 0, 1);
      // this.scene.add(dirLight);
      const light = new THREE.AmbientLight('#fff'); // soft white light
      this.scene.add(light);
    },
    sceneInit() { // 场景
      this.scene = new THREE.Scene();
    },
    cameraInit() { // 相机
      this.camera = new THREE.PerspectiveCamera(75, 2 / 1, 1, 1000);
      this.camera.position.z = 300;
      this.camera.position.y = 0;
      const orbitcontrols = new OrbitControls(this.camera, document.getElementById('container'));
      // orbitcontrols.enableDamping = true; // 惯性
    },
    renderInit() { // 渲染器
      const container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 锯齿感
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor('#fff');
      container.appendChild(this.renderer.domElement);
    },
    geometryInit() { // 物体
      this.marking = new THREE.Group();
      const groupLines = new THREE.Group();
      const earthGeometry = new THREE.SphereBufferGeometry(100, 32, 32);
      const textureLoader = new THREE.TextureLoader();
      const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load('textures/planets/earth_atmos_2048.jpg'),
      });
      const mesh = new THREE.Mesh(earthGeometry, earthMaterial);
      this.scene.add(mesh);

      const ballFrom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 30, 30), new THREE.MeshBasicMaterial({
        color: '#1bb4b0',
      }));
      const ballPosFrom = this.getPosition(120.15 + 90, 30.28, 100);
      ballFrom.position.set(ballPosFrom.x, ballPosFrom.y, ballPosFrom.z);
      this.marking.add(ballFrom);
      this.scene.add(this.marking);
      const ballTo = new THREE.Mesh(new THREE.SphereGeometry(0.5, 30, 30), new THREE.MeshBasicMaterial({
        color: '#1bb4b0', // '#1bb4b0'
      }));
      // 获取标记点坐标
      const ballPosTo = this.getPosition(110.15 + 90, 20.18, 100);
      ballTo.position.set(ballPosTo.x, ballPosTo.y, ballPosTo.z);

      const line = this.addLine(ballFrom.position, ballTo.position);// 迁徙方向，第一个参数是起始方向
      groupLines.add(line.lineMesh);
      console.log(line.lineMesh);
      this.animateDots.push(line.curve.getPoints(150));
      this.scene.add(groupLines);
    },
    renderRun() { // 渲染过程
      requestAnimationFrame(this.renderRun);
      if (this.index < 150) {
        this.index++;
      } else {
        this.index = 0;
      }
      const pos = this.animateDots[0][this.index];
      this.marking.children[0].position.set(pos.x, pos.y, pos.z);
      const materials = this.createMaterial();
      this.renderer.render(this.scene, this.camera);
    },
    createMaterial() {
      // 通过uniforms属性传递的变量可以在着色器程序中使用
      const uniforms = {
        time: {
          type: 'f',
          value: 0.2,
        },
        scale: {
          type: 'f',
          value: 0.2,
        },
        alpha: {
          type: 'f',
          value: 0.6,
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(),
        },
      };

      const element = document.getElementById('container');
      uniforms.resolution.value.x = element.clientWidth;
      uniforms.resolution.value.y = element.clientHeight;

      const meshMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.shaderMaterials,
        transparent: true,
      });

      return meshMaterial;
    },
    getPosition(_longitude, _latitude, _radius) {
      const lg = THREE.MathUtils.degToRad(_longitude);
      const lt = THREE.MathUtils.degToRad(_latitude);
      const temp = _radius * Math.cos(lt);
      const x = temp * Math.sin(lg);
      const y = _radius * Math.sin(lt);
      const z = temp * Math.cos(lg);
      return {
        x,
        y,
        z,
      };
    },
    // 计算球体上两个点的中点
    getVCenter(v1, v2) {
      const v = v1.add(v2);
      return v.divideScalar(2);
    },
    // 计算球体两点向量固定长度的点
    getLenVcetor(v1, v2, len) {
      const v1v2Len = v1.distanceTo(v2);
      return v1.lerp(v2, len / v1v2Len);
    },
    // 添加轨迹函数
    addLine(v0, v3) {
      const angleRate = 0.5;
      const angle = (v0.angleTo(v3) * 180) / Math.PI;
      const aLen = angle * angleRate * (1 - angle / (Math.PI * 90));
      const hLen = angle * angle * 1.2 * (1 - angle / (Math.PI * 90));
      const p0 = new THREE.Vector3(0, 0, 0);
      // 法线向量
      const rayLine = new THREE.Ray(p0, this.getVCenter(v0.clone(), v3.clone()));
      // 顶点坐标
      const vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));
      // 控制点坐标
      const v1 = this.getLenVcetor(v0.clone(), vtop, aLen);
      const v2 = this.getLenVcetor(v3.clone(), vtop, aLen);
      // 绘制贝塞尔曲线
      const curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
      const geometry = new THREE.Geometry();
      geometry.vertices = curve.getPoints(100);
      const line = new MeshLine();
      line.setGeometry(geometry);
      const material = new MeshLineMaterial({
        color: 'red',
        lineWidth: 0.1,
        transparent: true,
        opacity: 1,
      });
      return {
        curve,
        lineMesh: new THREE.Mesh(line.geometry, material),
      };
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
