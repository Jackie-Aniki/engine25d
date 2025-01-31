import {
  AmbientLight,
  CubeTextureLoader,
  DirectionalLight,
  Group,
  LinearSRGBColorSpace,
  Scene,
  WebGLRenderer
} from 'three';
import { Camera } from './camera';
import { state } from './state';

export class Renderer extends WebGLRenderer {
  now = Date.now();
  scene: Scene = new Scene();
  camera: Camera = new Camera();
  animations: Array<(time: number) => void> = [];
  light?: DirectionalLight;

  constructor() {
    super({ antialias: true, powerPreference: 'high-performance' });

    this.setSize(innerWidth, innerHeight);
    this.setAnimationLoop(this.animation.bind(this));
    this.outputColorSpace = LinearSRGBColorSpace;
    this.scene.add(new AmbientLight(0xffeecc, 0.5));

    const loader = new CubeTextureLoader();
    const skyBox = loader.load(Array.from({ length: 6 }, () => 'skybox.jpg'));

    this.scene.background = skyBox;

    document.body.appendChild(this.domElement);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  animation() {
    const now = Date.now();
    const time = now - this.now;

    this.now = Date.now();
    this.animations.forEach((animation) => animation(time));

    this.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();

    this.setSize(innerWidth, innerHeight);
  }

  async loadMesh(path: string): Promise<Group> {
    return new Promise((resolve) => {
      state.fbxLoader.load(path, (object: Group) => {
        resolve(object);
      });
    });
  }
}
