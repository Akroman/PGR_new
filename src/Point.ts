import * as vec3 from 'gl-matrix/cjs/vec3';

export class Point {
    public x: number;
    public y: number;
    public z: number;


    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    public get position(): vec3 {
        return vec3.fromValues(this.x, this.y, this.z);
    }


    public set position(position: vec3) {
        [this.x, this.y, this.z] = position;
    }
}