import { init, textures } from './state';
import { ViewLevel } from './view-level';

init().then(() => {
  new ViewLevel([
    textures.groundE,
    textures.groundW,
    textures.groundN,
    textures.groundS,
    textures.grass,
    textures.grass
  ]);
});
