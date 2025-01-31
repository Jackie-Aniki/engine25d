import { groupBits, System } from 'detect-collisions';
import { Raycaster, Texture, Vector2, Vector3 } from 'three';
import { Loader } from './loader';
import { Key, MaskBits, State } from './model';
import { Renderer } from './renderer';

export const keys: Partial<Record<Key, boolean>> = {};

export const textures: Record<string, Texture> = {};

export const physics = new System();

export const renderer = new Renderer();

export const raycaster = new Raycaster(new Vector3(), new Vector3(), 3, 12);

export const floors = [
  groupBits(MaskBits.Floor0),
  groupBits(MaskBits.Floor1),
  groupBits(MaskBits.Floor2),
  groupBits(MaskBits.Floor3),
  groupBits(MaskBits.Floor4)
];

export const mouse = new Vector2();

export const loader = new Loader();

export const state: State = {
  keys,
  mouse,
  direction: Math.random() * 2 * Math.PI
};
