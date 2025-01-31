import { PerspectiveCamera, Vector3 } from 'three';

export class Camera extends PerspectiveCamera {
  distance: number;
  levelSize: number;
  targetX: number;
  targetY: number;

  constructor(levelSize = 32, distance = 3) {
    super(70, innerWidth / innerHeight, 0.2, levelSize * 1.33);

    this.distance = distance;
    this.levelSize = levelSize;
    this.setPosition(levelSize / 2, levelSize / 2);
  }

  getPosition(targetX?: number, targetY?: number) {
    if (typeof targetX !== 'undefined' && typeof targetY !== 'undefined') {
      this.targetX = targetX;
      this.targetY = targetY;
    }

    return new Vector3(
      Math.max(1, Math.min(this.levelSize - 2, this.targetX)),
      Math.max(1, Math.min(this.levelSize - 2, this.targetY)),
      0.5 + this.distance * 0.67
    );
  }

  setPosition(targetX?: number, targetY?: number) {
    const { x, y, z } = this.getPosition(targetX, targetY);

    this.position.set(x, y, z);
    this.lookAt(this.targetX, this.targetY, 0);
    this.up = new Vector3(0, 0, 1);
  }
}
