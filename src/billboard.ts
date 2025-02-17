import { Mesh, PlaneGeometry, Vector3 } from 'three';
import { BillboardBody } from './billboard-body';
import { Level } from './level';
import {
  Direction,
  DirectionsToRows,
  Material,
  TexturedBillboardProps
} from './model';
import { directions, physics, renderer, state } from './state';
import { createMaterial, normalizeAngle } from './utils';

export class Billboard {
  z = 0;
  frame = 0;
  direction: Direction = 'up';
  material: Material;
  mesh: Mesh;
  body: BillboardBody;
  scale: Vector3;
  cols: number;
  rows: number;
  frameDuration: number;
  invCols: number;
  invRows: number;
  invFrameDuration: number;
  totalFrames: number;
  directionsToRows: DirectionsToRows;
  level?: Level;

  constructor(props: TexturedBillboardProps) {
    this.material = createMaterial(props.textureName, props.cols, props.rows);
    this.mesh = new Mesh(new PlaneGeometry(1, 1), this.material);
    this.cols = props.cols || 1;
    this.rows = props.rows || 1;
    this.frameDuration = props.frameDuration || 120;
    this.invCols = 1 / this.cols;
    this.invRows = 1 / this.rows;
    this.invFrameDuration = 1 / this.frameDuration;
    this.totalFrames = props.totalFrames || 1;
    this.directionsToRows = props.directionsToRows || { default: 0 };
    this.body = new BillboardBody();

    const w = this.material.map!.image.width / this.cols;
    const h = this.material.map!.image.height / this.rows;
    const m = Math.max(w, h) / (props.scale || 1);
    this.scale = new Vector3(w / m, h / m, 1);

    renderer.scene.add(this.mesh);
    renderer.animations.push((ms: number) => {
      this.update(ms);
    });
  }

  update(_ms: number): void {
    this.mesh.position.set(this.body.x, this.z, this.body.y);
    this.mesh.quaternion.copy(renderer.camera.quaternion);
    this.mesh.up = renderer.camera.up;
    this.direction = this.getDirection();
    this.updateTexture();
  }

  protected spawn(level: Level) {
    const x = (Math.random() * Level.cols) / 2;
    const y = (Math.random() * Level.rows) / 2;

    this.level = level;
    this.body.setPosition(x, y);
    this.z = this.getFloorZ();
    this.mesh.position.set(x, this.z, y);

    physics.insert(this.body);
  }

  protected getFloorZ({ x, y } = this.body) {
    return this.level ? this.level.getFloor(x, y) / 2 : 0;
  }

  protected updateTexture() {
    const frameIndex = Math.floor(this.frame);
    const row = this.getRow(this.direction);
    const x = frameIndex % this.cols;
    const y = Math.floor(frameIndex * this.invCols) + row;
    const { map } = this.mesh.material as any;

    map?.offset.set(x * this.invCols, y * this.invRows);

    if (this.direction === 'left') {
      this.scale.x = -Math.abs(this.scale.x);
    }

    if (this.direction === 'right') {
      this.scale.x = Math.abs(this.scale.x);
    }

    if (this.mesh.scale.x !== this.scale.x) {
      this.mesh.scale.copy(this.scale);
    }
  }

  protected getDirection() {
    const angle = normalizeAngle(this.body.angle - state.player.body.angle);
    const directionIndex = Math.floor((2 * angle) / Math.PI); // Szybsze (4 * angle) / (2 * Math.PI)

    return directions[directionIndex];
  }

  protected getRow(direction: Direction) {
    return (
      this.rows -
      this.totalFrames * this.invCols -
      ((this.directionsToRows[direction] ?? this.directionsToRows.default) || 0)
    );
  }
}
