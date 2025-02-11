import { Circle } from 'detect-collisions';
import { floors } from './state';

export class BillboardBody extends Circle {
  angle = Math.random() * Math.PI * 2;

  constructor(radius = 0.25) {
    super({}, radius, { group: floors[0] });
  }
}
