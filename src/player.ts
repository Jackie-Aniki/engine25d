import { Camera } from './camera';
import { Level } from './level';
import { TexturedBillboardProps } from './model';
import { renderer, state } from './state';
import { TexturedBillboard } from './textured-billboard';
import { ViewLevel } from './view-level';

export class Player extends TexturedBillboard {
  readonly isPlayer = true;
  readonly state = state;

  constructor(level: Level, props: TexturedBillboardProps) {
    super(props);

    this.spawn(level);

    renderer.camera.setLevel(level);
    renderer.camera.setRef(this);

    if (level instanceof ViewLevel) {
      renderer.scene.add(level.mesh);
      renderer.camera.onCameraUpdate();
      renderer.animations.push((ms: number) => {
        renderer.camera.onCameraUpdate(ms * Camera.lerpRatio);
      });
    }
  }
}
