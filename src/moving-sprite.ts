import { Level } from './level';
import { BillboardProps, State } from './model';
import { MovingBillboard } from './moving-billboard';

export class MovingSprite extends MovingBillboard {
  constructor(level: Level, props: BillboardProps, state?: State) {
    super(props, state);
    this.spawn(level);
  }
}
