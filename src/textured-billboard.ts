import { MeshBasicMaterial } from 'three';
import { Billboard } from './billboard';
import { Material } from './model';
import { renderer } from './state';
import { createMaterial } from './utils';

export type AnimationsDirection = 'down' | 'right' | 'up' | 'left';

export type AnimationsOrder = Partial<
  Record<AnimationsDirection | 'default', number>
>;

export interface TexturedBillboardProps {
  materialName: string;
  animationsOrder: AnimationsOrder;
  animationsDuration: number;
  totalFramesInAnimation: number;
}

export class TexturedBillboard extends Billboard {
  static directions: AnimationsDirection[] = ['down', 'right', 'up', 'left'];
  static reverseDirections: AnimationsDirection[] = [
    'up',
    'left',
    'down',
    'right'
  ];
  static findByAngle =
    (angle: number) => (_animation: unknown, index: number) =>
      angle >= (Math.PI / 2) * index && angle < (Math.PI / 2) * (index + 1);

  readonly isPlayer: boolean = false;

  frame = 0;
  animationsOrder: AnimationsOrder;
  animationsDuration: number;
  totalFramesInAnimation: number;

  constructor({
    materialName = '',
    animationsDuration = 120,
    animationsOrder = {},
    totalFramesInAnimation = 6
  }: TexturedBillboardProps) {
    super(createMaterial(materialName));

    this.animationsDuration = animationsDuration;
    this.animationsOrder = animationsOrder;
    this.totalFramesInAnimation = totalFramesInAnimation;
  }

  protected getDirection() {
    const characterAngle = this.normalize(this.body.angle);
    const cameraAngle = this.normalize(
      renderer.camera.rotation.z - Math.PI / 2
    );
    const angle = this.normalize(characterAngle - cameraAngle + Math.PI / 4);
    const findByAngle = TexturedBillboard.findByAngle(angle);
    const direction = TexturedBillboard.directions.find(findByAngle);

    return this.gear === -1
      ? TexturedBillboard.reverseDirections[direction]
      : direction;
  }

  protected getRow(direction: AnimationsDirection) {
    return this.animationsOrder[direction] ?? this.animationsOrder.default;
  }

  protected update(ms: number) {
    super.update(ms);

    if (Object.values(this.state.keys).some(Boolean)) {
      this.frame =
        (this.frame + ms / this.animationsDuration) %
        this.totalFramesInAnimation;
    }

    const frame = Math.floor(this.frame);
    const direction = this.getDirection();
    const row = this.getRow(direction);
    const x = (frame % 3) / 3;
    const y = (Math.floor(frame / 3) + row) / this.totalFramesInAnimation;

    const material = this.mesh.material as Material;
    if (material instanceof MeshBasicMaterial) {
      material.map?.offset.set(x, y);
      this.scale.x = (direction === 'left' ? -1 : 1) * Math.abs(this.scale.x);
    }
  }
}
