import { Billboard } from './billboard';
import { Level } from './level';

const props = {
  textureName: 'palm',
  scale: 3
};

export class Palm extends Billboard {
  constructor(level: Level, x?: number, y?: number) {
    super(props);
    this.spawn(level, x, y);
  }
}
