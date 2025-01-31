import { Euler, Quaternion, Texture, Vector3 } from 'three';
import { Box } from './box';
import { Level } from './level';
import { floors, physics, renderer } from './state';
import { getMatrix } from './utils';

export class ViewLevel extends Level {
  constructor(textures: Texture[], levelSize = 32) {
    super(levelSize);

    const mesh = new Box(this.size * this.size, textures);
    const forEachHeight = this.forEachHeight(mesh);

    this.heights.forEach(forEachHeight);
    renderer.scene.add(mesh);
  }

  forEachHeight(mesh: Box) {
    return (row: number[], x: number) =>
      row.forEach((value: number, y: number) => {
        const min = this.heights[x][y];
        const height = Math.min(min, value) / 2;
        const angle = Math.floor(Math.random() * 4) * 90;

        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(
          new Vector3(0, 0, 1),
          (angle * Math.PI) / 180
        );

        const euler = new Euler();
        euler.setFromQuaternion(quaternion);

        mesh.setMatrixAt(
          y * this.size + x,
          getMatrix(
            new Vector3(x, y, height / 2),
            euler,
            new Vector3(1, 1, height)
          )
        );

        for (let floor = 0; floor < height * 2; floor++) {
          physics.createBox({ x, y }, 1, 1, {
            isStatic: true,
            group: floors[floor]
          });
        }
      });
  }
}
