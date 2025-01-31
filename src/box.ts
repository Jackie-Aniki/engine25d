import { BoxGeometry, InstancedMesh, MeshBasicMaterial, Texture } from 'three';

export class Box extends InstancedMesh {
  constructor(count: number, textures: Texture[]) {
    const geometry = new BoxGeometry(1, 1, 1);
    const materials = textures.map((map) => new MeshBasicMaterial({ map }));

    super(geometry, materials, count);
  }
}
